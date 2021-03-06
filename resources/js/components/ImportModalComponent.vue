<template>
  <Transition name="fade">
    <div 
      v-if="showImportModal"
      class="fixed inset-0 w-full h-screen flex items-center justify-center bg-semi-75 z-10"
      @click.self="close"
    >
      <div class="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h2 class="text-xl font-bold text-gray-900">
          Import Wallets from JSON
        </h2>
        <p class="mb-6">
          Paste your JSON here to import wallets.
        </p>
        <form>
          <textarea 
            v-model="walletsJson" 
            class="w-full h-16 resize-y border rounded focus:outline-none focus:shadow-outline" 
          />
          <div class="inline-flex items-center justify-between">
            <button 
              v-if="!loading" 
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 w-40 rounded focus:outline-none focus:shadow-outline" 
              type="button"
              @click="submit"
            >
              Import
            </button>

            <button 
              v-if="loading" 
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 w-40 rounded focus:outline-none focus:shadow-outline opacity-50" 
              type="button"
            >
              Importing...
            </button>
          </div>
          <button 
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 w-40 rounded focus:outline-none focus:shadow-outline"
            @click.prevent="close"
          >
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
                walletsJson: null,

                loading: false
          }
        },

        computed: {
            showImportModal() {
                return this.$store.getters.importModal;
            }
        },

        methods: {
            async close() {
                this.walletsJson = null;
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
                    const validatedInput = JSON.parse(this.walletsJson);

                    this.loading = true;

                    let walletCounter = 0;

                    if (validatedInput) {
                        // Handle the JSON generated by the desktop wallet
                        if (Object.prototype.hasOwnProperty.call(validatedInput, 'meta')) {
                            const importedAddresses = await this.getAddressesFromArkWalletJSON(validatedInput);
                            
                            let type = validatedInput.network.name;
                            type = type.charAt(0) + type.slice(1).toLowerCase();
                            
                            for (let address of importedAddresses) {
                                if(!this.$store.getters.wallet(address))
                                {
                                    let wallet = await this.makeWalletFromAddress(address, type);
                                    walletCounter += 1;
                                    this.$store.dispatch('addWallet', wallet);
                                }
                            }
                        } else {
                            for (let wallet of validatedInput) {
                                if(!this.$store.getters.wallet(wallet.address)) {
                                    walletCounter += 1;
                                    this.$store.dispatch('addWallet', wallet);
                                }
                            }
                        }

                        this.loading = false;
                        
                        let singularOrPlural = walletCounter > 1 ? "Wallets" : "Wallet";
                        let sentence = walletCounter > 0 ? 
                            `${singularOrPlural} imported ! ${walletCounter} new ${singularOrPlural.toLowerCase()} added.` :
                            "All imported wallets are already monitored.";
                        
                        await this.makeToast(`${sentence}`, "check-circle", "success");
                    } else {
                        this.loading = false;
                        await this.makeToast("Can't submit empty field.", "times-circle", "warning");
                    }
                } catch (e) {
                    this.walletsJson = null;
                    this.loading = false;

                    await this.makeToast("Invalid JSON format", "times-circle", "error");
                }
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