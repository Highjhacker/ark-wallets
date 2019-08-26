<template>
    <div class="flex items-center justify-center">
        <div class="ml-6">
            <a href="/" class="text-lg font-semibold text-gray-100 no-underline">
                Wallets Watcher
            </a>
        </div>
        <div class="flex-1 text-right">
            <toggle-button @change="onChangeEventHandler"
                           v-model="toggleSwitch"
                           :value="false"
                           color="#82C7EB"
                           :sync="true"
                           :labels="true"
                           v-tooltip.right="'Toggle Arkvatars'"/>
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
