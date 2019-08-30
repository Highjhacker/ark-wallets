/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
import Vuex from 'vuex'
import Toasted from 'vue-toasted';
import VTooltip from 'v-tooltip'
import toast from "./mixins";
import ToggleButton from 'vue-js-toggle-button';
require('./bootstrap');

window.Vue = require('vue');

Vue.config.productionTip = false;
//Vue.config.devtools = false;

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
        hideArkvatars: false,
        wallets: JSON.parse(localStorage.getItem("addresses")) || [],
    },
    mutations: {
        toggleArkvatars (state) {
            state.hideArkvatars = !state.hideArkvatars;
        }
    },
    getters: {
        getWallets: state => {
          return state.wallets
        },

        hideArkvatars: state => {
            return state.hideArkvatars;
        }
    }
});

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    store,
    data() {
        return {
            wallets: JSON.parse(localStorage.getItem("addresses")) || [],
            toggleArkvatars: false,
            exampleModalShowing: false
        }
    },
});
