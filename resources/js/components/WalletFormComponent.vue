<template>
  <div>
    <form
      method="POST"
      class="w-full max-w-sm"
      @submit.prevent="validateForm"
    >
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-2/3">
          <input
            id="walletAddress"
            v-model="walletAddress"
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            name="walletAddress"
            type="text"
            placeholder="Valid Wallet Address"
          >
        </div>

        <div class="relative m-4">
          <select
            id="grid-state"
            v-model="selected"
            class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          >
            <option>Ark</option>
            <option>Qredit</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              class="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="md:flex md:items-center h-8">
        <div class="md:w-2/3">
          <button
            v-if="!isProcessing"
            class="hover:bg-blue-custom bg-white font-bold rounded-full py-4 px-8 shadow-lg uppercase tracking-wider w-full h-16"
            type="submit"
          >
            Add Wallet
          </button>

          <button
            v-if="isProcessing"
            class="bg-white font-bold rounded-full py-4 px-8 shadow-lg uppercase tracking-wider w-full h-16"
          >
            <Stretch v-if="isProcessing" />
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
    import {Stretch} from 'vue-loading-spinner';

    export default {
        components: {Stretch},

        data() {
            return {
                walletAddress: null,
                arkvatarUrl: null,
                type: null,
                id: null,

                isProcessing: false,

                selected: 'Ark'
            }
        },

        methods: {
            async validateAddress(address) {
                try {
                    const usernameCheck = await this.validateDelegateUsername(address);
                    if (usernameCheck) {
                        return true;
                    }
                    return await axios.get(`https://retos.dev/api/verify/${address}`, {}, {headers: {'Content-Type': 'application/json'}});
                } catch (error) {
                    if (error.response.status === 422) {
                        return true;
                    }
                }
            },

            async validateDelegateUsername(username) {
                // Not handling pagination atm, so it only works for delegate on the first page
                const api = await this.getApiForType(this.type);
                const delegatesResponse = await this.getDelegatesUsernames(api.url)
                const filtered = delegatesResponse.data.data.map(wallet => wallet.username);

                if (filtered.includes(username)) {
                    return true;
                }
            },

            async validateForm() {
                try {
                    this.type = this.selected;

                    if (this.walletAddress == null) {
                        return await this.makeToast("Can't submit an empty address.", "exclamation-triangle", "error");
                    }

                    this.isProcessing = true;

                    if (this.$store.getters.wallet(this.walletAddress)) {
                        this.isProcessing = false;
                        return await this.makeToast("Wallet already monitored.", "exclamation-triangle", "error");
                    }

                    if (!await this.validateAddress(this.walletAddress)) {
                        this.isProcessing = false;
                        return await this.makeToast("Invalid address.", "exclamation-triangle", "error");
                    }

                    const explorer = await this.getExplorerForType(this.type);
                    const api = await this.getApiForType(this.type);

                    const userWalletResponse = await this.queryApi(this.type, this.walletAddress);

                    if (!userWalletResponse.data.data.vote) {
                        this.isProcessing = false;
                        return await this.makeToast("This wallet have no delegate.", "exclamation-triangle", "error");
                    }

                    let delegatePublicKey = userWalletResponse.data.data.vote;
                    let delegateData = await this.getDelegateData(api.url, delegatePublicKey);

                    let delegateShareData = await this.getDelegateShare(this.type, delegateData.data.data.username);

                    this.arkvatarUrl = await this.getArkvatar(delegateData.data.data.address);

                    this.id = Vue.moment().unix();

                    const walletData = {
                        'id': this.id,
                        'address': this.walletAddress,
                        'walletBalance': userWalletResponse.data.data.balance,
                        'arkvatarUrl': this.arkvatarUrl,
                        'type': this.type,
                        'apiUrl': api.url,
                        'explorerUrl': explorer.url,
                        'delegateUsername': delegateData.data.data.username,
                        'delegateAddress': delegateData.data.data.address,
                        'delegatePublicKey': delegatePublicKey,
                        'delegateVotesTotal': delegateData.data.data.votes,
                        'delegateRank': delegateData.data.data.rank,
                        'delegateSharePercentage': delegateShareData.data.payout_percent,
                        'delegatePayoutInterval': delegateShareData.data.payout_interval
                    };

                    this.$store.dispatch('addWallet', walletData);

                    this.isProcessing = false;

                    return await this.makeToast("Wallet added !", "check-circle", "success");
                } catch (error) {
                  return;
                }
            }
        }
    }
</script>

<style>
    .toasted.bubble.error {
        background-color: #f1373a;
    }

    .toasted.bubble.success {
        background-color: #28a745;
    }

    .toasted.bubble.warning {
        background-color: #f1b637;
    }

    .hover\:bg-blue-custom:hover {
        background-color: #D9ECE9;
    }
</style>