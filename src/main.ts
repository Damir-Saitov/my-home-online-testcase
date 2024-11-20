import Vue from 'vue';
import Quasar, {
  Loading,
  Notify,
} from 'quasar';
import quasarLangRu from 'quasar/lang/ru';
import 'quasar/dist/quasar.min.css';
import '@quasar/extras/material-icons/material-icons.css';

import App from '@/App.vue';
import { store } from '@/store';
import { router } from '@/router';
import { vueI18n } from '@/i18n';


Vue.use(Quasar, {
  lang: quasarLangRu,
  components: [],
  plugins: {
    Notify,
    Loading,
  },
  config: {
    brand: {
      primary: '#44A248',
      secondary: '#26A69A',
      accent: '#9C27B0',

      dark: '#1d1d1d',
      'dark-page': '#121212',

      positive: '#21BA45',
      negative: '#C10015',
      info: '#31CCEC',
      warning: '#F2C037',
    },
  },
});

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  i18n: vueI18n,
  render: (h) => h(App),
}).$mount('#app');
