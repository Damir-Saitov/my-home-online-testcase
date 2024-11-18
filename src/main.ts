import Vue from 'vue';
import Quasar from 'quasar';
import quasarLangRu from 'quasar/lang/ru';
import 'quasar/dist/quasar.min.css';

import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import i18n from '@/i18n';


Vue.use(Quasar, {
  lang: quasarLangRu,
  components: [],
});

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
