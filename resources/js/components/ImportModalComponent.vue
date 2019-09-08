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

            async submit() {
                try {
                    let validatedInput = JSON.parse(this.walletsJson);

                    if (validatedInput) {
                        let existing = localStorage.getItem("addresses");
                        existing = existing ? JSON.parse(existing) : [];

                        let merged = existing.concat(validatedInput);

                        let filtered = _.uniqBy(merged, "address");

                        localStorage.setItem("addresses", JSON.stringify(filtered));

                        await this.makeToast("Wallets imported !", "check-circle", "success");
                        
                        this.$nextTick(async () => {
                            window.location.reload();
                        });
                    }
                } catch (e) {
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