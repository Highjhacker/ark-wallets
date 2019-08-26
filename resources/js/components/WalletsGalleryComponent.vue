<template>
    <div class="flex flex-wrap -mx-1 lg:-mx-4">
        <wallet-card-component v-for="wallet in wallets" :key="wallet.id" :wallet-address="wallet"></wallet-card-component>
        <fab
                :position="position"
                :bg-color="bgColor"
                :actions="fabActions"
                @exportWallets="exportWallets"
                @importWallets="importWallets"
        ></fab>
    </div>
</template>

<script>
    /*
      Need to refactor and use Stores (VueX) instead
    */
    import fab from 'vue-fab';

    export default {
        components: {fab},

        data() {
            return {
                wallets: this.$root.$data.wallets,

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
                        color: '#FF4136'
                    }
                ]
            }
        },

        methods: {
            async importWallets() {
                this.$root.$data.exampleModalShowing = true;
            },

            async exportWallets() {
                let existing = localStorage.getItem("addresses");
                existing = existing ? JSON.parse(existing) : [];

                this.copyToClipboard(JSON.stringify(existing));

                await this.makeToast("Successfully exported to clipboard !", "check-circle", "success");
            },
        }
    }
</script>
