import Vue from 'vue';
import Vuex from 'vuex';

import type { AuthLoginPostResult } from '@/api/auth';


Vue.use(Vuex);

export const StoreGetters = { logined: 'logined' } as const;
export const StoreMutations = {
  login: 'login',
  logout: 'logout',
} as const;

// eslint-disable-next-line max-len
const employeeIdLocalStorageKey = 'bXktaG9tZS1vbmxpbmUtdGVzdGNhc2U6ZW1wbG95ZWVJZExvY2FsU3RvcmFnZUtleQ==';
const keyLocalStorageKey = 'bXktaG9tZS1vbmxpbmUtdGVzdGNhc2U6a2V5TG9jYWxTdG9yYWdlS2V5';

export const store = new Vuex.Store({
  state: {
    employeeId: undefined as undefined | number,
    key: undefined as undefined | string,
  },
  getters: {
    [StoreGetters.logined](state) {
      return Boolean(state.employeeId && state.key);
    },
  },
  mutations: {
    [StoreMutations.login](state, payload: AuthLoginPostResult) {
      state.employeeId = payload.employee_id;
      state.key = payload.key;
      // eslint-disable-next-line import/no-cycle
      import('@/axios')
        .then((module) => {
          module.api.setAuthorization(payload.key);
        });
      localStorage.setItem(employeeIdLocalStorageKey, String(payload.employee_id));
      localStorage.setItem(keyLocalStorageKey, payload.key);
    },
    [StoreMutations.logout](state) {
      state.employeeId = undefined;
      state.key = undefined;
      // eslint-disable-next-line import/no-cycle
      import('@/axios')
        .then((module) => {
          module.api.removeAuthorization();
        });
      localStorage.removeItem(employeeIdLocalStorageKey);
      localStorage.removeItem(keyLocalStorageKey);
    },
  },
  actions: {},
  modules: {},
});

// Загрузка данных авторизации
const employeeIdString = localStorage.getItem(employeeIdLocalStorageKey);
const key = localStorage.getItem(keyLocalStorageKey);
if (employeeIdString && key) {
  const employeeId = Number(employeeIdString);
  if (Number.isFinite(employeeId)) {
    store.commit(
      StoreMutations.login,
      {
        employee_id: employeeId,
        key,
      },
    );
  } else {
    store.commit(StoreMutations.logout);
  }
}
