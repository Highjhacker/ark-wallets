<template>
    <div class="container mx-auto px-6 py-2 flex justify-between items-center">
        <a class="font-bold text-2xl lg:text-4xl" href="#">
            ArkWallets
        </a>

        <div class="lg:block">
            <ul class="inline-flex">
                <li>
                    <toggle-button @change="onChangeEventHandler"
                                   v-model="toggleSwitch"
                                   :value="false"
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
        data() {
            return {
                toggleSwitch: false,
            }
        },

        methods: {
            async onChangeEventHandler() {
                if(this.toggleSwitch === false) {
                    this.$root.$data.toggleArkvatars = false;
                } else {
                    this.$root.$data.toggleArkvatars = true;
                }
            }
        }
    }
</script>
