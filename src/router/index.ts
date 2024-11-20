import Vue from 'vue';
import VueRouter from 'vue-router';
import type { RouteConfig } from 'vue-router';

import type {
  store,
  StoreActions,
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
  routes: routes.map(createLazyRoute),
});


export function setAccessGuard(
  _store: typeof store,
  _StoreActions: typeof StoreActions,
  _StoreGetters: typeof StoreGetters,
) {
  router.beforeEach((to, from, next) => {
    if (to.fullPath === from.fullPath) {
      next(false);

    } else if (!_store.getters[_StoreGetters.logined] && to.meta?.requiresAuth) {
      _store.dispatch(_StoreActions.logout);
      next({ name: RouteName.Login });

    } else if (_store.getters[_StoreGetters.logined] && !to.meta?.requiresAuth) {
      next({ name: RouteName.Main });

    } else {
      next();
    }
  });

  router.addRoute({
    path: '*',
    redirect() {
      if (_store.getters[_StoreGetters.logined]) {
        return { name: RouteName.Main };
      }
      return { name: RouteName.Login };
    },
  });
}


router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = (
      vueI18n.t(`RouteName.${to.name}`) as string
      || vueI18n.t('RouteName._default') as string
      || 'My Home Online'
    );
  });
});
