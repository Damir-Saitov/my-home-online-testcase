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

import { router } from '@/router';


const loadingGroup = 'app-loading';

@Component
export default class LoginView extends Vue {
  loading = true;

  beforeCreate() {
    Loading.show({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      spinner: QSpinnerHourglass,
      spinnerSize: 100,
      group: loadingGroup,
    });
  }

  created() {
    router.onReady(() => {
      this.loading = false;
      Loading.hide(loadingGroup);
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
