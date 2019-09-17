/* eslint-disable no-undef */
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist';
import localforage from 'localforage';
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

const vuexLocalStorage = new VuexPersist({
    key: 'addresses', 
    storage: localforage,
    asyncStorage: true
})

const store = new Vuex.Store({
    state: {
        showArkvatars: true,
        showImportModal: false,
        wallets: [],
    },

    plugins: [vuexLocalStorage.plugin],
    
    mutations: {
        toggleArkvatars: (state) => {
            state.showArkvatars = !state.showArkvatars;
        },

        handleImportModal: (state) => {
            state.showImportModal = !state.showImportModal;
        },

        addWallet: (state, wallet) => {
            state.wallets.push(wallet);
        },

        updateWallet: (state, payload) => {
            const index = state.wallets.findIndex(item => item.address === payload.address);
            state.wallets.splice(index, 1);

            state.wallets.push(payload.payload);
        },

        deleteWallet: (state, address) => {
            const index = state.wallets.findIndex(item => item.address === address);
            state.wallets.splice(index, 1);
        },

        clearWallets: (state) => {
            state.wallets = [];
        }
    },

    actions: {
        addWallet: ({commit}, wallet) => {
            commit('addWallet', wallet);
        },

        updateWallet: ({commit}, payload) => {
            commit('updateWallet', {address: payload.address, payload: payload.payload});
        },

        deleteWallet: ({commit}, wallet) => {
            commit('deleteWallet', wallet);
        }
    },
    
    getters: {
        arkvatars: state => state.showArkvatars,

        importModal: state => state.showImportModal,

        wallet: (state) => (address) => {
            if(state.wallets.length > 0) {
                return state.wallets.find(item => {
                    return item.address === address
                });
            }
        },

        wallets: state => state.wallets
    }
});

// eslint-disable-next-line
const app = new Vue({
    el: '#app',
    store,
});
