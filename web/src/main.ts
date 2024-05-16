import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import { router } from './router';
import vuetify from './plugins/vuetify';
import VueTablerIcons from 'vue-tabler-icons';
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import 'vue-toast-notification/dist/theme-default.css'

import VCalendar from 'v-calendar';
import Maska from 'maska';
//ScrollTop
import VueScrollTo from 'vue-scrollto';

import AOS from 'aos';
import 'aos/dist/aos.css';
import '@/scss/style.scss';

AOS.init({
  duration: 1200,
});

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const toastOptions = {
  position: 'top-right',
}

const app = createApp(App);
app.use(ToastPlugin, toastOptions);
app.use(router);
app.use(pinia);
app.use(VCalendar, {});
app.use(VueTablerIcons);
app.use(Maska);
app.use(vuetify).mount('#app');
//ScrollTop Use
// app.use(VueScrollTo);
app.use(VueScrollTo, {
  duration: 1000,
  easing: 'ease',
});
