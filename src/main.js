import Vue from 'vue';
import './plugins/vuetify';
import './plugins/fragment';
import App from './App';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
