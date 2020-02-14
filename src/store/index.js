import Vue from 'vue';
import Vuex from 'vuex';

import actions from './actions';
import getters from './getters';
import mutations from './mutations';

import PharmaciesMap from './PharmaciesMap/index';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    PharmaciesMap
  },

  state: {
  },
  mutations,
  actions,
  getters,
  // In strict mode, whenever Vuex state is mutated outside of mutation handlers,
  // an error will be thrown. This ensures that all state mutations can be
  // explicitly tracked by debugging tools.

  // NOTE: Do not enable strict mode when deploying for production! Strict mode
  // runs a deep watch on the state tree for detecting inappropriate mutations -
  // make sure to turn it off in production to avoid the performance cost.
  strict: process.env.NODE_ENV !== 'production'
});

export default store;
