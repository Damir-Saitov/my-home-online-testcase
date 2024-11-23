<i18n>
{
  "ru": {
    "methods": {
      "search": {
        "error": "Не удалось получить список домов"
      }
    }
  }
}
</i18n>

<template>
<QSelect
  v-bind="$attrs"
  class="full-width"
  use-input
  input-debounce="0"
  :loading="loading"
  :options="options"
  :value="value"
  @input="$emit('input', $event)"
  @filter="onFilter"
/>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
} from 'vue-property-decorator';
import {
  QSelect,
  debounce,
} from 'quasar';

import type {
  Option,
  Premise,
} from '@/types';
import { geoUserPremisesGet } from '@/api/geo';
import { api } from '@/axios';


@Component({ components: { QSelect } })
export default class PremiseSelect extends Vue {
  @Prop({ required: true })
  value!: Option<Premise['id']>;

  abortController = undefined as undefined | AbortController;

  loading = false;

  options = undefined as undefined | Option<Premise['id']>[];

  searchingValue = undefined as undefined | string;

  search() {
    this.abortController?.abort();

    this.abortController = new AbortController();
    this.loading = true;

    geoUserPremisesGet(
      { search: this.searchingValue },
      { signal: this.abortController.signal },
    )
      .then((response) => {
        if (response.config.signal !== this.abortController?.signal) {
          return;
        }

        const premises = response.data.results;
        this.options = new Array(premises.length);

        for (let index = 0; index < premises.length; index++) {
          this.options[index] = {
            label: premises[index].full_address,
            value: premises[index].id,
          };
        }

        this.loading = false;
        this.$forceUpdate();
      })
      .catch((error) => {
        if (api.isCancel(error)) {
          return;
        }
        api.showErrorMessage(error, this.$t('methods.search.error') as string);
        this.loading = false;
      });
  }

  searchDebounced = debounce(this.search, 300);

  onFilter(value: string, update: (fn: () => void) => void) {
    this.searchingValue = value;
    if (!value) {
      update(this.search);
    } else {
      update(this.searchDebounced);
    }
  }

  created() {
    this.options = undefined;
  }

  beforeDestroy() {
    this.abortController?.abort();
  }
}
</script>

<style scoped>

</style>
