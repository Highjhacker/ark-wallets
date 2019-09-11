<template>
  <!-- Column -->
  <div class="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/4 py-4">
    <!-- Article -->
    <article class="overflow-hidden rounded-lg shadow-lg">
      <a v-if="showArkvatars">
        <img
          v-tooltip.top="wallet.address" 
          :alt="wallet.address" 
          :class="{'opacity-50': inactive}" 
          class="block h-auto w-full" 
          :src="arkvatarUrl" 
        >
      </a>
      <header class="flex items-center justify-between leading-tight p-2 md:p-4">
        <h1 class="text-lg">
          <p class="no-underline text-black">
            {{ delegateUsername }}
          </p>
          <p class="flex items-center no-underline text-black text-sm">
            {{ walletBalance | formatArktoshis(false) | currencyDecimal }} {{ displayCurrencySign }}
          </p>
          <p class="flex items-center no-underline text-black text-sm has-tooltip">
            {{ dailyCalc | currencyDecimal }} {{ displayCurrencySign }} daily <br> {{ [delegatePayoutInterval, 'hours'] | duration('humanize') | formatSharingSchedule }}
          </p>
        </h1>
        <p 
          v-show="delegateIsGreen"
          class="text-grey-darker text-sm" 
        >
          <i 
            v-tooltip.bottom="'Forging'" 
            class="fas fa-check-circle mx-auto has-tooltip" 
          />
        </p>

        <p 
          v-show="!delegateIsGreen && delegateIsGreen != null"
          class="text-grey-darker text-sm"
        >
          <i 
            v-tooltip.bottom="'Not Forging'" 
            class="fas fa-times-circle mx-auto has-tooltip" 
          />
        </p>

        <p
          v-show="delegateIsGreen == null" 
          class="text-grey-darker text-sm"
        >
          <i 
            v-tooltip.bottom="'Unknown'" 
            class="fas fa-question-circle mx-auto has-tooltip" 
          />
        </p>
      </header>

      <footer class="flex items-center justify-between leading-none p-2 md:p-4">
        <div class="md:flex-wrap inline-flex content-between">
          <button
            v-tooltip.bottom="'Remove Wallet'"
            class="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded mx-1 md:mb-2"
            @click="removeCard(wallet.address)" 
          >
            <i class="far fa-trash-alt" />
          </button>

          <a :href="`${wallet.explorerUrl}wallets/${wallet.address}`">
            <button 
              v-tooltip.bottom="'See on Explorer'"
              class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mx-1 md:mb-2"
            >
              <i class="fas fa-link" />
            </button>
          </a>

          <button 
            tooltip.bottom="'Payouts History'"
            class="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded mx-1 opacity-50 cursor-not-allowed md:mb-2"
          >
            <i class="fas fa-history" />
          </button>

          <button 
            v-tooltip.bottom="'Refresh Wallet'"
            class="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded mx-1 md:mb-2"
            @click="updateCard(wallet.address)"
          >
            <i class="fas fa-sync" />
          </button>
        </div>
      </footer>
    </article>
    <!-- END Article -->
  </div>
  <!-- END Column -->
</template>

<script>
    export default {
      filters: {
            currencyDecimal(value) {
                return value.toFixed(2)
            },

            countDecimals(value) {
                if (value % 1 != 0) return value.toString().split(".")[1].length;
                return 0;
            },

            formatArktoshis(value, rounded = false) {
                let normalized = value / 1e8;
                let response = rounded ? Math.round(normalized) : normalized;

                return response;
            },

            formatSharingSchedule(value) {
                return value === 'a few seconds' ? 'unknown' : value;
            },
        },

        props: {
          wallet: {
            type: Object,
            default: null
          }
        },

        data() {
            return {
                walletBalance: null,

                delegatePublicKey: null,
                delegateUsername: null,
                delegateAddress: null,
                delegateVotesTotal: null,
                delegateRank: null,
                delegateSharePercentage: null,
                delegatePayoutInterval: null,
                delegateIsForging: null,
                delegateIsActive: null,
                delegateIsGreen: null,

                arkvatarUrl: null,
                inactive: false,
            }
        },

        computed: {
            dailyCalc () {
                if (isNaN(this.delegateSharePercentage)) {
                    return 0;
                }

                return this.walletBalance / this.delegateVotesTotal * 422 * this.delegateSharePercentage / 100;
            },

            weeklyCalc () {
                return this.dailyCalc * 7;
            },

            monthlyCalc () {
                return this.dailyCalc * 30;
            },

            displayCurrencySign () {
                const signs = [
                    {'type': 'Ark', 'sign': 'Ѧ'},
                    {'type': 'Qredit', 'sign': 'XQR'},
                ];
                
                return signs.find(match => match.type === this.wallet.type).sign;
            },

            showArkvatars () {
                return this.$store.getters.arkvatars;
            }
        },

        async mounted() {
            let wallet = await this.findInStore(this.wallet.address);

            if (wallet) {
                this.walletBalance = wallet.walletBalance;
                this.delegatePublicKey = wallet.delegatePublicKey;
                this.delegateUsername = wallet.delegateUsername;
                this.delegateAddress = wallet.delegateAddress;
                this.delegateVotesTotal = wallet.delegateVotesTotal;
                this.delegateRank = wallet.delegateRank;
                this.delegateSharePercentage = wallet.delegateSharePercentage;
                this.delegatePayoutInterval = wallet.delegatePayoutInterval;
                this.arkvatarUrl = wallet.arkvatarUrl;
            }

            await this.getDataFromAddress();

            setInterval(() => {
                this.isDelegateGreen();
            }, 60000);
        },

        methods: {
            async findInStore(address) {
                return this.$store.getters.wallet(address);
            },

            async updateCard(address) {
                let walletData = await this.getDataFromAddress();

                this.$store.dispatch('updateWallet', {address: address, payload: walletData});

                await this.makeToast("Wallet Updated.", "check-circle", "success");
            },

            async removeCard(address) {
                this.$store.dispatch('deleteWallet', address);

                await this.makeToast("Wallet removed", "check-circle", "success");
            },

            async isDelegateActive() {
                const delegateCap = await this.getDelegateCapForType(this.wallet.type);
                return (this.delegateRank <= delegateCap.amount ? this.delegateIsActive = true : this.delegateIsActive = false);
            },

            async isDelegateGreen() {
                return (this.delegateIsActive && this.delegateIsForging ? this.delegateIsGreen = true : this.delegateIsGreen = false);
            },

            async calculateForgingTime(delegateResponse) {
                let lastBlockForged = delegateResponse.data.data.blocks.last.timestamp.unix;
                let now = Vue.moment().unix();
                let timeDifference = now - lastBlockForged;
                timeDifference <= 600 ? this.delegateIsForging = true : this.delegateIsForging = false;
            },

            async getDataFromAddress() {
                try {
                    [this.walletBalance, this.delegatePublicKey] = await this.getWalletBalanceAndDelegatePublicKey(this.wallet.apiUrl, this.wallet.address);

                    if (this.delegatePublicKey) {
                        // Fetch information about user's delegate
                        const walletDelegate = await this.getDelegateData(this.wallet.apiUrl, this.delegatePublicKey);
                        this.delegateVotesTotal = walletDelegate.data.data.votes;
                        this.delegateRank = walletDelegate.data.data.rank;
                        this.delegatePublicKey = walletDelegate.data.data.publicKey;
                        this.delegateAddress = walletDelegate.data.data.address;

                        // Get the delegate sharing information
                        const delegateShare = await this.getDelegateShare(this.wallet.type, walletDelegate.data.data.username);
                        this.delegateSharePercentage = delegateShare.data.payout_percent;
                        this.delegatePayoutInterval = delegateShare.data.payout_interval;

                        if (this.wallet.type === 'Ark') {
                            this.delegateUsername = delegateShare.data.name;
                        }

                        // Calculate the time difference since last block, if inferior to twelve minutes it's good.
                        await this.calculateForgingTime(walletDelegate);

                        // Check if the delegate is active or standby.
                        await this.isDelegateActive();

                        // Check if delegate is green
                        await this.isDelegateGreen();

                        return {
                            'id': this.wallet.id,
                            'address': this.wallet.address,
                            'walletBalance': this.walletBalance,
                            'arkvatarUrl': this.arkvatarUrl,
                            'type': this.wallet.type,
                            'apiUrl': this.wallet.apiUrl,
                            'explorerUrl': this.wallet.explorerUrl,
                            'delegateUsername': this.delegateUsername || 'Unknown',
                            'delegateAddress': this.delegateAddress || 'Unknown',
                            'delegatePublicKey': this.delegatePublicKey || 'Unknown',
                            'delegateVotesTotal': this.delegateVotesTotal || 'Unknown',
                            'delegateRank': this.delegateRank || 'Unknown',
                            'delegateSharePercentage': this.delegateSharePercentage || 'Unknown',
                            'delegatePayoutInterval': this.delegatePayoutInterval || 'Unknown'
                        };
                    } else {
                        this.inactive = true;
                    }
                } catch (error) {
                    console.log("Failed to fetch data.");
                }
            },
        }
    }
</script>

<style>
    .toasted.bubble.success {
        background-color: #28a745;
    }

    .fas.fa-check-circle {
        color: #28a745;
    }

    .fas.fa-times-circle {
        color: #f1373a;
    }
</style>