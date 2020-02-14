import Vue from 'vue';
import App from './views/App/App.vue';
import './registerServiceWorker';
import router from './router/router';
import store from './store';

import './style/main.styl';

// register global components
import './components';

import 'leaflet/dist/leaflet.css';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
