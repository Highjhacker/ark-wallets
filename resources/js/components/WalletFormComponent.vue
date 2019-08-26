<template>
    <form @submit.prevent="validateForm" method="POST" class="w-full max-w-sm">
        <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/3">
                <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="walletAddress">
                    Wallet Address
                </label>
            </div>
            <div class="md:w-2/3">
                <div v-if="errors.length">
                    <b>Please correct the following error(s):</b>
                    <ul>
                        <li v-for="error in errors">{{ error }}</li>
                    </ul>
                </div>
                <input class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="walletAddress" v-model="walletAddress" name="walletAddress" type="text" placeholder="Valid Wallet Address">
            </div>
        </div>

        <div class="md:flex md:items-center h-8">
            <div class="md:w-1/3"></div>
            <div class="md:w-2/3">
                <button v-if="!isProcessing" class="shadow green-spinner focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded h-8" type="submit">
                    Add Wallet
                </button>
                <Stretch class="" v-if="isProcessing"></Stretch>
            </div>
        </div>
    </form>
</template>

<script>
    import {Stretch} from 'vue-loading-spinner';

    export default {
        components: {Stretch},
        data() {
            return {
                errors: [],
                walletAddress: null,
                arkvatarUrl: null,

                isProcessing: false,
            }
        },

        methods: {
            async validateAddress(address) {
                try {
                    return await axios.get(`https://retos.io/api/verify/${address}`, {}, {headers: {'Content-Type': 'application/json'}});
                } catch (error) {
                    if (error.response.status === 422) {
                        // Will require more work for bridgechains later
                        // probably something around if response in ['ark', 'ki', ...]
                        return true;
                    }
                }
            },

            async validateForm() {
                if (this.walletAddress == null)
                {
                    return await this.makeToast("Can't submit an empty address.", "exclamation-triangle", "error");
                }

                this.isProcessing = true;

                // Get the localStorage array and the existings keys in it
                let existing = localStorage.getItem("addresses");
                existing = existing ? JSON.parse(existing) : [];

                if(existing.find(wallet => wallet.address === this.walletAddress)) {
                    this.isProcessing = false;
                    return await this.makeToast("Wallet already monitored.", "exclamation-triangle", "error");
                }

                if (!await this.validateAddress(this.walletAddress))
                {
                    this.isProcessing = false;
                    return await this.makeToast("Invalid address.", "exclamation-triangle", "error");
                }

                const userWalletResponse = await axios.get(`https://node1.arknet.cloud/api/wallets/${this.walletAddress}`);

                if (!userWalletResponse.data.data.vote) {
                    this.isProcessing = false;
                    return await this.makeToast("This wallet have no delegate.", "exclamation-triangle", "error");
                }

                const delegateData = {'address': this.walletAddress, 'url': this.arkvatarUrl};

                // Address isn't present, add it
                this.$root.$data.wallets.push(delegateData);
                existing.push(delegateData);

                localStorage.setItem("addresses", JSON.stringify(existing));

                await this.makeToast("Wallet added !", "check-circle", "success")
                this.isProcessing = false;
            }
        }
    }
</script>

<style>
    .green-spinner {
        background-color: rgb(65, 184, 131);
    }

    .green-spinner:hover {
        background-color: #57d69c;
    }
    .toasted.bubble.error {
        background-color: #f1373a;
    }
    .toasted.bubble.success {
        background-color: #28a745;
    }
</style>