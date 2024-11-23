<i18n>
{
  "ru": {
    "template": {
      "create": "Создать",
      "search": "Поиск (№ заявки, название)",
      "premise": "Дом",
      "appealsCurrentPaginationText": "{first} – {last} из {count}",
      "appealsCount": "0 записей | {n} запись | {n} записи | {n} записей"
    },
    "methods": {
      "getAppeals": {
        "error": "Не удалось получить список заявок"
      }
    }
  }
}
</i18n>

<template>
<div class="main-view">
  <div class="text-right">
    <QBtn
      color="primary"
      type="submit"
      :label="$t('template.create')"
    />
  </div>

  <div class="row q-col-gutter-md">
    <div class="col-6">
      <QInput
        class="full-width"
        :label="$t('template.search')"
        :value="filters.search"
        @input="setFilterSearch"
        @blur="filters.search = filters.search?.trim()"
      >
        <template #append>
          <QIcon name="search" />
        </template>
      </QInput>
    </div>

    <div class="col-6">
      <QSelect
        class="full-width"
        :label="$t('template.premise')"
        @input="updateTable()"
        v-model="filters.premise_id"
      />
    </div>
  </div>

  <AppealsTable
    :loading="loading"
    :data="appeals"
    :pagination="pagination"
  />

  <div class="mt-36px flex content-center">
    <div class="mr-auto">
      {{ appealsCurrentPaginationText }}
      <QSelect
        class="inline-flex"
        :options="rowsPerPageOptions"
        :value="pagination.rowsPerPage"
        @input="updateTable({ rowsPerPage: $event.value })"
      />
    </div>

    <div>
      <QPagination
        boundary-numbers
        boundary-links
        direction-links
        round
        padding="0.5em"
        color="grey-7"
        active-color="primary"
        :max-pages="6"
        :max="Math.ceil(pagination.rowsNumber / pagination.rowsPerPage)"
        :value="pagination.page"
        @input="updateTable({ page: $event })"
      />
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from 'vue-property-decorator';
import {
  QInput,
  QSelect,
  QBtn,
  QDialog,
  QIcon,
  QPagination,
  debounce,
} from 'quasar';

import AppealsTable from '@/components/MainView/AppealsTable.vue';
import { appealsGet } from '@/api/appeals';
import type { AppealsGetData } from '@/api/appeals';
import { api } from '@/axios';
import type {
  Appeal,
  Pagination,
  Option,
} from '@/types';


interface UpdateTableParams {
  page?: Pagination['page'],
  rowsPerPage?: Pagination['rowsPerPage'],
}
const eparams: UpdateTableParams = {};


const rowsPerPageOptions: Option<number>[] = [
  {
    label: '10',
    value: 10,
  },
  {
    label: '20',
    value: 20,
  },
  {
    label: '30',
    value: 30,
  },
  {
    label: '40',
    value: 40,
  },
  {
    label: '50',
    value: 50,
  },
];

@Component({
  components: {
    QInput,
    QSelect,
    QBtn,
    QDialog,
    QIcon,
    QPagination,

    AppealsTable,
  },
})
export default class MainView extends Vue {
  loading = true;

  getAppealsAbortController = undefined as undefined | AbortController;

  pagination: Pagination = {
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0,
  };

  appeals = undefined as undefined | Appeal[];

  rowsPerPageOptions = undefined as undefined | typeof rowsPerPageOptions;

  filters = {
    search: undefined as AppealsGetData['search'],
    premise_id: undefined as AppealsGetData['premise_id'],
  };


  get appealsCurrentPaginationText(): string {
    const last = this.pagination.page * this.pagination.rowsPerPage;
    return this.$t(
      'template.appealsCurrentPaginationText',
      {
        first: String(last - this.pagination.rowsPerPage + 1),
        last: String(Math.min(last, this.pagination.rowsNumber)),
        count: this.$tc('template.appealsCount', this.pagination.rowsNumber),
      },
    ) as string;
  }

  getAppeals() {
    this.getAppealsAbortController?.abort();

    this.getAppealsAbortController = new AbortController();
    this.loading = true;
    appealsGet(
      {
        page: this.pagination.page,
        page_size: this.pagination.rowsPerPage,

        search: this.filters.search?.trim(),
        premise_id: this.filters.premise_id,
      },
      { signal: this.getAppealsAbortController.signal },
    )
      .then((response) => {
        if (response.config.signal !== this.getAppealsAbortController?.signal) {
          return;
        }

        this.appeals = response.data.results;
        this.pagination.rowsNumber = response.data.count;
        this.loading = false;
        this.$forceUpdate();
      })
      .catch((error) => {
        if (api.isCancel(error)) {
          return;
        }
        api.showErrorMessage(error, this.$t('methods.getAppeals.error') as string);
        this.loading = false;
      });
  }


  updateTable(params?: UpdateTableParams) {
    const {
      rowsPerPage,
      page,
    } = params || eparams;

    if (rowsPerPage) {
      this.pagination.rowsPerPage = rowsPerPage;
    }

    this.pagination.page = page || 1;
    this.getAppeals();
  }

  // eslint-disable-next-line prefer-arrow-callback
  updateTableDebounced = debounce(this.updateTable, 300);

  setFilterSearch(value: InstanceType<typeof MainView>['filters']['search']) {
    this.filters.search = value;
    this.updateTableDebounced();
  }


  created() {
    this.rowsPerPageOptions = rowsPerPageOptions;
    this.appeals = [];
    this.getAppeals();
  }
}
</script>

<style scoped>
.main-view {
  overflow-y: auto;
  max-height: 100%;
  padding: 10px 20px;
}
</style>
