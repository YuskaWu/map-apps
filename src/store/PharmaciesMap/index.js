import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const store = {
  namespaced: true,
  state: {
  },
  mutations,
  actions,
  getters
};

export default store;
