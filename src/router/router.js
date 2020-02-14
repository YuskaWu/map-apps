import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {path: '/', redirect: {name: 'pharmacies-map'}},
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // },
  {
    path: '/pharmacies-map',
    name: 'pharmacies-map',
    component: () => import('../views/PharmaciesMap/PharmaciesMap.vue')
  }
];

const router = new VueRouter({
  routes
});

export default router;
