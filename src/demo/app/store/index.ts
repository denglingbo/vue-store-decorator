import Vue from 'vue';
import Vuex from 'vuex';
// import createPersistedState from 'vuex-persistedstate';
import modules from './modules';

Vue.use(Vuex);

const stores = {
  strict: process.env.NODE_ENV !== 'production',
  state: {},
  mutations: {},
  actions: {},
  modules,
  plugins: [
    // 暂时关闭数据持久化
    // createPersistedState({ storage: window.sessionStorage }),
  ],
};

export default new Vuex.Store(stores);
