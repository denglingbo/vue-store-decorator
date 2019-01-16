import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
  {
    path: '',
    name: 'store-decorator',
    component: () => import('../index.vue'),
  }
];

export default new Router({
  mode: 'history',
  routes
});
