import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';


Vue.use(VueRouter);


type SimpleRouteConfig = RouteConfig & { children?: SimpleRouteConfig[] };
function createLazyRoute(path: SimpleRouteConfig) {
  const result: RouteConfig = {
    ...path,
    component: () => import(`@/views/${path.name}View.vue`),
  };
  if (path.children) {
    result.children = path.children.map(createLazyRoute);
  }
  return result;
}


// eslint-disable-next-line no-shadow
export const enum RouteName {
  Main = 'Main',
  Login = 'Login',
}


const routes: Array<SimpleRouteConfig> = [
  {
    path: '/',
    name: RouteName.Main,
  },
  {
    path: '/login',
    name: RouteName.Login,
  },
];

export const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes.map(createLazyRoute),
});
