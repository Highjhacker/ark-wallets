/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
import Toasted from 'vue-toasted';
import VTooltip from 'v-tooltip'
import toast from "./mixins";
import ToggleButton from 'vue-js-toggle-button';
require('./bootstrap');

window.Vue = require('vue');
Vue.mixin(toast);
Vue.use(require('vue-moment'));
Vue.use(Toasted, {iconPack: 'fontawesome'});
Vue.use(VTooltip);
Vue.use(ToggleButton);

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i);
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

Vue.component('wallet-card-component', require('./components/WalletCardComponent.vue').default);
Vue.component('wallet-form-component', require('./components/WalletFormComponent.vue').default);
Vue.component('wallets-gallery-component', require('./components/WalletsGalleryComponent.vue').default);
Vue.component('navbar-component', require('./components/NavbarComponent.vue').default);
Vue.component('modal-component', require('./components/ImportModalComponent.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    data() {
        return {
            wallets: JSON.parse(localStorage.getItem("addresses")) || [],
            toggleArkvatars: false,
            exampleModalShowing: false,
        }
    },
});
