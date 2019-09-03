<template>
    <div class="container mx-auto px-6 py-2 flex justify-between items-center">
        <a class="font-bold text-2xl lg:text-4xl" href="#">
            ArkWallets
        </a>

        <div class="lg:block">
            <ul class="inline-flex">
                <li>
                    <toggle-button
                            :value="showArkvatars"
                            @change="change"
                            color="#82C7EB"
                            :sync="true"
                            :labels="true"/>
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
                console.log(this.$store.state.showArkvatars);
            }
        },

        computed: {
            showArkvatars() {
                return this.$store.state.showArkvatars;
            }
        }
    }
</script>
