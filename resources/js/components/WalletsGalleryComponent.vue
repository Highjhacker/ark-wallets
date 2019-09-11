<template>
    <div class="flex flex-wrap -mx-1 lg:-mx-4">
        <wallet-card-component v-for="wallet in orderedWallets" :key="wallet.id" :wallet="wallet"></wallet-card-component>
        <fab
                :position="position"
                :bg-color="bgColor"
                :actions="fabActions"
                @exportWallets="exportWallets"
                @importWallets="importWallets"
                @clearAll="clearAll"
        ></fab>
    </div>
</template>

<script>
    import fab from 'vue-fab';

    export default {
        components: {fab},

        data() {
            return {
                bgColor: '#57d69c',
                position: 'bottom-right',
                fabActions: [
                    {
                        name: 'importWallets',
                        icon: 'arrow_drop_up',
                        tooltip: 'Import Wallets',
                        color: '#57d69c'
                    },
                    {
                        name: 'exportWallets',
                        icon: 'arrow_drop_down',
                        tooltip: 'Export Wallets',
                        color: '#85c1e9'
                    },
                    {
                        name: 'clearAll',
                        icon: 'delete',
                        tooltip: 'Delete all wallets',
                        color: '#FF4136'
                    }
                ]
            }
        },

        methods: {
            async importWallets() {
                this.$store.commit('handleImportModal');
            },

            async exportWallets() {
                this.copyToClipboard(JSON.stringify(this.$store.getters.wallets));

                await this.makeToast("Successfully exported to clipboard !", "check-circle", "success");
            },

            async clearAll() {
                this.$store.commit('clearWallets');

                await this.makeToast("Successfully deleted all wallets !", "check-circle", "success");
            }
        },
        
        computed: {
            orderedWallets: function () {
                return _.orderBy(this.$store.getters.wallets, 'id');
            }
        }
    }
</script>
