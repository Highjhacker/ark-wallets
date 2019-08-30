<template>
    <div class="container mx-auto px-6 py-2 flex justify-between items-center">
        <a class="font-bold text-2xl lg:text-4xl" href="#">
            ArkWallets
        </a>

        <div class="lg:block">
            <ul class="inline-flex">
                <li>
                    <toggle-button @change="change"
                                   color="#82C7EB"
                                   :sync="true"
                                   :labels="true"
                                   v-tooltip.right="'Toggle Arkvatars'"/>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            async change() {
                this.$store.commit('toggleArkvatars');
            }
        },

        computed: {
            hideArkvatars() {
                return this.$store.state.hideArkvatars;
            }
        }
    }
</script>
