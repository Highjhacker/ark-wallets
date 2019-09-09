/* eslint-disable no-undef */
import Vuex from 'vuex'
import Toasted from 'vue-toasted';
import VTooltip from 'v-tooltip'
import toast from "./mixins";
import ToggleButton from 'vue-js-toggle-button';
require('./bootstrap');

window.Vue = require('vue');

Vue.use(Vuex);
Vue.mixin(toast);
Vue.use(require('vue-moment'));
Vue.use(Toasted, {iconPack: 'fontawesome'});
Vue.use(VTooltip);
Vue.use(ToggleButton);

Vue.component('wallet-card-component', require('./components/WalletCardComponent.vue').default);
Vue.component('wallet-form-component', require('./components/WalletFormComponent.vue').default);
Vue.component('wallets-gallery-component', require('./components/WalletsGalleryComponent.vue').default);
Vue.component('navbar-component', require('./components/NavbarComponent.vue').default);
Vue.component('modal-component', require('./components/ImportModalComponent.vue').default);

/** VueX Store **/
const store = new Vuex.Store({
    state: {
        showArkvatars: true,
        showImportModal: false,
        wallets: JSON.parse(localStorage.getItem("addresses")) || [],
    },
    mutations: {
        toggleArkvatars (state) {
            state.showArkvatars = !state.showArkvatars;
        },

        handleImportModal (state) {
            state.showImportModal = !state.showImportModal;
        },

        addWallet(state, wallet) {
            state.wallets.push(wallet);
        },

        clearWallets(state) {
            state.wallets = [];
        }
    },
    getters: {
        walletByAddress: (state) => (address) => {
            return state.wallets.filter(item => {
                return item.address === address
            })[0];
        },
        wallets: state => {
            return state.wallets
        },

        arkvatars: state => {
            return state.showArkvatars;
        },

        importModal: state => {
            return state.showImportModal;
        }
    }
});

// eslint-disable-next-line
const app = new Vue({
    el: '#app',
    store,
});
