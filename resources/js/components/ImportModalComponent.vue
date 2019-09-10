<template>
    <Transition name="fade">
        <div v-if="showImportModal"
             class="fixed inset-0 w-full h-screen flex items-center justify-center bg-semi-75 z-10"
             @click.self="close">

            <div class="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
                <h2 class="text-xl font-bold text-gray-900">Import Wallets from JSON</h2>
                <p class="mb-6">Paste your JSON here to import wallets.</p>
                <form>
                    <textarea v-model="walletsJson" class="w-full h-16 resize-y border rounded focus:outline-none focus:shadow-outline"></textarea>
                    <div class="inline-flex items-center justify-between">
                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button"
                            @click="submit">
                            Import
                        </button>
                    </div>
                    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        @click.prevent="close">
                        Close
                    </button>
                </form>
            </div>
        </div>
    </Transition>
</template>

<script>
    export default {
        data() {
            return {
                walletsJson: null
            }
        },

        methods: {
            async close() {
                this.$store.commit('handleImportModal');
            },

            async getAddressesFromArkWalletJSON(data) {
                return data.wallets.map(wallet => wallet.address);
            },

            async makeWalletFromAddress(address, type) {
                const apiUrl = await this.getApiForType(type);
                const explorerUrl = await this.getExplorerForType(type);
                const [walletBalance, delegatePublicKey] = await this.getWalletBalanceAndDelegatePublicKey(apiUrl.url, address);

                const walletDelegate = await this.getDelegateData(apiUrl.url, delegatePublicKey);
                const delegateShare = await this.getDelegateShare(type, walletDelegate.data.data.username);
                
                // Generate a random number for the ID of the Wallet, we add the walletBalance to avoid having the same IDs twice while importing
                const walletId = Vue.moment().unix() + walletBalance;
                const arkvatarUrl = await this.getArkvatar(walletDelegate.data.data.address);

                return {
                    'id': walletId,
                    'address': address,
                    'walletBalance': walletBalance,
                    'arkvatarUrl': arkvatarUrl,
                    'type': type,
                    'apiUrl': apiUrl.url,
                    'explorerUrl': explorerUrl.url,
                    'delegateUsername': delegateShare.data.name || 'Unknown',
                    'delegateAddress': walletDelegate.data.data.address || 'Unknown',
                    'delegatePublicKey': delegatePublicKey || 'Unknown',
                    'delegateVotesTotal': walletDelegate.data.data.votes || 'Unknown',
                    'delegateRank': walletDelegate.data.data.rank || 'Unknown',
                    'delegateSharePercentage': delegateShare.data.payout_percent || 'Unknown',
                    'delegatePayoutInterval': delegateShare.data.payout_interval || 'Unknown'
                };
            },

            async submit() {
                try {
                    let validatedInput = JSON.parse(this.walletsJson);
                    let existing = localStorage.getItem("addresses");
                    existing = existing ? JSON.parse(existing) : [];

                    if (validatedInput) {
                        if (validatedInput.hasOwnProperty('meta')) {
                            const importedAddresses = await this.getAddressesFromArkWalletJSON(validatedInput);
                            
                            let type = validatedInput.network.name;
                            type = type.charAt(0) + type.slice(1).toLowerCase();
                            
                            //let temp = [];

                            for (let address of importedAddresses) {
                                let wallet = await this.makeWalletFromAddress(address, type);
                                this.$store.commit('addWallet', wallet);
                                //temp.push(wallet);
                            }
                            
                            /*
                            const waitFor = (ms) => new Promise(r => setTimeout(r, ms))
                            
                            await importedAddresses.forEach(async (address) => {
                                await waitFor(50); 
                                this.$store.commit('addWallet', await this.makeWalletFromAddress(address, type));
                                //temp.push(wallet);
                            });
                            */

                            if(existing.length > 0) {
                                let merged = existing.concat(this.$store.state.wallets);
                                let filtered = _.uniqBy(merged, "address");
                                localStorage.setItem("addresses", JSON.stringify(filtered));
                            } else {
                                localStorage.setItem("addresses", JSON.stringify(this.$store.state.wallets));
                            }
                        } else {                            
                            let merged = existing.concat(validatedInput);

                            let filtered = _.uniqBy(merged, "address");

                            localStorage.setItem("addresses", JSON.stringify(filtered));
                        }

                        await this.makeToast("Wallets imported !", "check-circle", "success");
                            
                        //this.$nextTick(async () => {
                        //    window.location.reload();
                        //});
                    }
                } catch (e) {
                    console.log(e);
                    console.log("Invalid json");

                    await this.makeToast("Invalid JSON format", "times-circle", "error");
                }
            }
        },

        computed: {
            showImportModal() {
                return this.$store.state.showImportModal;
            }
        }
    }
</script>

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition: all 0.4s;
    }
    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }
</style>