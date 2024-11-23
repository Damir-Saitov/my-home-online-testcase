<i18n>
{
  "ru": {
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
  <AppealsTable
    v-if="appeals"
    :loading="loading"
    :data="appeals"
    :pagination.sync="pagination"
    @request="onTableRequest"
  />
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
} from 'quasar';

import AppealsTable from '@/components/MainView/AppealsTable.vue';
import { appealsGet } from '@/api/appeals';
import { api } from '@/axios';
import type {
  Appeal,
  Pagination,
} from '@/types';


@Component({
  components: {
    QInput,
    QSelect,
    QBtn,
    QDialog,
    QIcon,

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


  created() {
    // Убирает ошибку рендера
    this.appeals = undefined;
    this.getAppeals();
  }

  getAppeals() {
    this.getAppealsAbortController?.abort();

    this.getAppealsAbortController = new AbortController();
    this.loading = true;
    appealsGet(
      {
        page: this.pagination.page,
        page_size: this.pagination.rowsPerPage,
      },
      { signal: this.getAppealsAbortController.signal },
    )
      .then((response) => {
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


  onTableRequest(event: { pagination: Pagination }) {
    const pagination = event.pagination;
    const params: Parameters<InstanceType<typeof MainView>['updateTable']>['0'] = {};
    if (pagination.page !== this.pagination.page) {
      params.page = pagination.page;
    }
    if (pagination.rowsPerPage !== this.pagination.rowsPerPage) {
      params.rowsPerPage = pagination.rowsPerPage;
    }
    this.updateTable(params);
  }

  updateTable(params: {
    page?: Pagination['page'],
    rowsPerPage?: Pagination['rowsPerPage'],
  }) {
    const {
      rowsPerPage,
      page,
    } = params;

    if (rowsPerPage) {
      this.pagination.rowsPerPage = rowsPerPage;
    }

    this.pagination.page = page || 1;
    this.getAppeals();
  }
}
</script>

<style scoped>
.main-view {
  overflow-y: auto;
  max-height: 100%;
}
</style>
