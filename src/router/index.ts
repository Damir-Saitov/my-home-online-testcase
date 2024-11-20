import Vue from 'vue';
import VueRouter from 'vue-router';
import type { RouteConfig } from 'vue-router';

// eslint-disable-next-line import/no-cycle
import {
  store,
  StoreMutations,
  StoreGetters,
} from '@/store';
import { vueI18n } from '@/i18n';


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
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: RouteName.Login,
    meta: { requiresAuth: false },
  },
];

export const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    ...routes.map(createLazyRoute),
    {
      path: '*',
      redirect() {
        if (store.getters[StoreGetters.logined]) {
          return { name: RouteName.Main };
        }
        return { name: RouteName.Login };
      },
    },
  ],
});


router.beforeEach((to, from, next) => {
  if ((to.fullPath === from.fullPath) && from.name) {
    next(false);

  } else if (!store.getters[StoreGetters.logined] && to.meta?.requiresAuth) {
    store.commit(StoreMutations.logout);
    next({ name: RouteName.Login });

  } else if (store.getters[StoreGetters.logined] && !to.meta?.requiresAuth) {
    next({ name: RouteName.Main });

  } else {
    next();
  }
});


router.afterEach((to) => {
  Vue.nextTick(() => {
    const key = `RouteName.${to.name}`;
    const title = vueI18n.t(key) as string;
    document.title = (
      title !== key
        ? title
        : vueI18n.t('RouteName._default') as string
    );
  });
});
