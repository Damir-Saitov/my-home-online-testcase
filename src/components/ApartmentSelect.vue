<i18n>
{
  "ru": {
    "methods": {
      "search": {
        "error": "Не удалось получить список квартир"
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
  Watch,
} from 'vue-property-decorator';
import {
  QSelect,
  debounce,
} from 'quasar';

import type {
  Option,
  Apartment,
  Premise,
} from '@/types';
import { geoApartmentsGet } from '@/api/geo';
import { api } from '@/axios';


@Component({ components: { QSelect } })
export default class ApartmentSelect extends Vue {
  @Prop({ required: true })
  value!: Option<Apartment['id']>;

  @Prop({ required: true })
  premise_id!: Premise['id'];

  abortController = undefined as undefined | AbortController;

  loading = false;

  options = undefined as undefined | Option<Apartment['id']>[];

  searchingValue = undefined as undefined | string;

  search() {
    this.abortController?.abort();

    this.abortController = new AbortController();
    this.loading = true;

    geoApartmentsGet(
      {
        search: this.searchingValue,
        premise_id: this.premise_id,
      },
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
            label: premises[index].label,
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

  @Watch('premise_id')
  clearSearched() {
    if (!this.premise_id) {
      this.$emit('input', undefined);
      this.options = undefined;
    }
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
