<template>
    <!-- Column -->
    <div class="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/4 py-4" v-show="!deleted">
        <!-- Article -->
        <article class="overflow-hidden rounded-lg shadow-lg">
            <a v-if="!toggleArkvatars">
                <img :alt="walletAddress.address" class="block h-auto w-full" :src="arkvatarUrl" v-tooltip.top="walletAddress.address">
            </a>
            <header class="flex items-center justify-between leading-tight p-2 md:p-4">
                <h1 class="text-lg">
                    <p class="no-underline text-black">
                        {{ delegateUsername }}
                    </p>
                    <p class="flex items-center no-underline text-black text-sm">
                        {{ dailyCalc | currencyDecimal }} {{ displayCurrencySign }} daily <br /> {{ [delegatePayoutInterval, 'hours'] | duration('humanize') | formatSharingSchedule }}
                    </p>
                </h1>
                <p class="text-grey-darker text-sm" v-show="delegateIsGreen">
                    <i class="fas fa-check-circle mx-auto has-tooltip" v-tooltip.bottom="'Forging'"></i>
                </p>

                <p class="text-grey-darker text-sm" v-show="!delegateIsGreen && delegateIsGreen != null">
                    <i class="fas fa-times-circle mx-auto has-tooltip" v-tooltip.bottom="'Not Forging'"></i>
                </p>

                <p class="text-grey-darker text-sm" v-show="delegateIsGreen == null">
                    <i class="fas fa-question-circle mx-auto has-tooltip" v-tooltip.bottom="'Unknown'"></i>
                </p>
            </header>

            <footer class="flex items-center justify-between leading-none p-2 md:p-4">
                <div class="inline-flex content-between">
                    <button v-on:click="removeCard(walletAddress)" class="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded mx-1"
                            v-tooltip.bottom="'Remove Wallet'">
                        <i class="far fa-trash-alt"></i>
                    </button>

                    <a v-bind:href="`${walletAddress.explorerUrl}wallets/${walletAddress.address}`">
                        <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mx-1"
                                v-tooltip.bottom="'See on Explorer'">
                            <i class="fas fa-link"></i>
                        </button>
                    </a>

                    <button class="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded mx-1 opacity-50 cursor-not-allowed"
                            v-tooltip.bottom="'Payouts History'">
                        <i class="fas fa-history"></i>
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
        props:['wallet-address'],

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
                deleted: false,

                arkvatarUrl: null,
                toggleArkvatar: false,
            }
        },

        filters: {
            currencyDecimal(value) {
                return value.toFixed(2)
            },

            formatSharingSchedule(value) {
                if (value === '6 hours') { return 'every 6 hours'; }
                if (value === '12 hours') { return 'every 12 hours'; }
                if (value === 'a day') { return 'daily'; }
                if (value === '2 days') { return '2 days'; }
                if (value === '3 days') { return '3 days'; }
                if (value === '5 days') { return '5 days'; }
                if (value === '7 days') { return 'weekly'; }
                else { return 'unknown'; }
            },
        },

        mounted() {
            let wallet = this.findInLocalStorage(this.walletAddress.address);

            if (wallet) {
                this.walletBalance = wallet.walletBalance;
                this.delegatePublicKey = wallet.delegatePublicKey;
                this.delegateUsername = wallet.delegateUsername;
                this.delegateAddress = wallet.delegateAddress;
                this.delegateVotesTotal = wallet.delegateVotesTotal;
                this.delegateRank = wallet.delegateRank;
                this.delegateSharePercentage = wallet.delegateSharePercentage || 'Unknown';
                this.delegatePayoutInterval = wallet.delegatePayoutInterval || 'Unknown';
                this.arkvatarUrl = wallet.arkvatarUrl;
            }

            this.getDataFromAddress();

            setInterval(() => {
                this.checkIfDelegateIsGreen();
            }, 60000);
        },

        methods: {
            findInLocalStorage(address) {
                let existing = localStorage.getItem("addresses");
                existing = existing ? JSON.parse(existing) : [];
                let filtered = existing.filter(function(el) { return el.address === address});
                return filtered[0];
            },

            async removeCard(walletAddress) {
                let existing = localStorage.getItem("addresses");
                existing = existing ? JSON.parse(existing) : [];

                let filtered = existing.filter(function(el) { return el.address !== walletAddress.address});

                localStorage.setItem("addresses", JSON.stringify(filtered));

                this.deleted = true;

                await this.makeToast("Wallet removed", "check-circle", "success");
            },

            async getWalletBalance() {
                const request = await axios.get(`${this.walletAddress.apiUrl}wallets/${this.walletAddress.address}`);

                return request.data.data.balance;
            },

            async isDelegateActive() {
                return (this.delegateRank <= 51 ? this.delegateIsActive = true : this.delegateIsActive = false);
            },

            async checkIfDelegateIsGreen() {
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
                    // Fetch the user input and process it on the /wallets/ endpoint of ARK API.
                    await this.getWalletBalance();

                    // Fetch information about user's delegate.
                    // const userDelegateResponse = await this.getDelegateData(this.walletAddress.apiUrl, this.delegatePublicKey);

                    // Calculate the time difference since last block, if inferior to twelve minutes it's good.
                    await this.calculateForgingTime(await this.getDelegateData(this.walletAddress.apiUrl, this.delegatePublicKey));

                    // Check if the delegate is active or standby.
                    await this.isDelegateActive();

                    // Get the user delegate share.
                    // await this.getDelegateShare();

                    // Check if delegate is green
                    await this.checkIfDelegateIsGreen();
                } catch (error) {
                    console.log("Failed to fetch data.");
                }
            },
        },
        computed: {
            dailyCalc: function () {
                if (isNaN(this.delegateSharePercentage)) {
                    return 0;
                }

                return this.walletBalance / this.delegateVotesTotal * 422 * this.delegateSharePercentage / 100;
            },

            weeklyCalc: function () {
                return this.dailyCalc * 7;
            },

            monthlyCalc: function () {
                return this.dailyCalc * 30;
            },

            toggleArkvatars: function() {
                return this.$root.$data.toggleArkvatars;
            },

            displayCurrencySign: function() {
                if (this.walletAddress.type === 'Ark') {
                    return 'Ѧ';
                }

                if (this.walletAddress.type === 'Qredit') {
                    return 'XQR';
                }
            }
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
