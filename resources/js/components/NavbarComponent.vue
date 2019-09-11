<template>
  <div class="container mx-auto px-6 py-2 flex justify-between items-center">
    <a 
      class="font-bold text-2xl lg:text-4xl" 
      href="/"
    >
      ArkWallets
    </a>

    <div class="lg:block">
      <ul class="inline-flex">
        <li>
          <toggle-button
            v-tooltip.right="'Display Arkvatars'"
            :value="showArkvatars"
            color="#82C7EB"
            :sync="true"
            :labels="true"
            @change="change"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
    export default {
        computed: {
            showArkvatars() {
                return this.$store.getters.arkvatars;
            }
        },

        methods: {
            async change() {
                this.$store.commit('toggleArkvatars');
            }
        }
    }
</script>
