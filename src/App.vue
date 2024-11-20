<template>
<router-view v-if="!loading" />
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from 'vue-property-decorator';
import {
  Loading,
  QSpinnerHourglass,
} from 'quasar';

import {
  store,
  StoreActions,
  StoreGetters,
} from '@/store';
import {
  RouteName,
  router,
  setAccessGuard,
} from '@/router';


@Component
export default class LoginView extends Vue {
  loading = true;

  created() {
    const loadingGroup = 'app-loading';
    Loading.show({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      spinner: QSpinnerHourglass,
      spinnerSize: 100,
      group: loadingGroup,
    });

    router.onReady(() => {
      store.dispatch(StoreActions.tryLoadLogin)
        .then(() => {
          if (store.getters[StoreGetters.logined]) {
            if (router.currentRoute.name !== RouteName.Main) {
              return router.push({ name: RouteName.Main });
            }
          } else if (router.currentRoute.name !== RouteName.Login) {
            return router.push({ name: RouteName.Login });
          }
        })
        .finally(() => {
          setAccessGuard(
            store,
            StoreActions,
            StoreGetters,
          );

          this.loading = false;
          Loading.hide(loadingGroup);
        });
    });
  }
}
</script>

<style lang="scss">
body {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-size: 14px;
}

.mt-28px {
  margin-top: 28px;
}
</style>
