import Vue from 'vue';
import './plugins/buefy';
import './common/monkeypatch';
import App from './App';
import router from './router';
import store from './store';
import './common/ws';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
