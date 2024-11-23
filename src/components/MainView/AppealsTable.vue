<i18n>
{
  "ru": {
    "columns": {
      "created_at": "Создана",
      "address": "Адрес",
      "applicant": "Заявитель",
      "description": "Описание",
      "due_date": "Срок",
      "status": "Статус"
    }
  }
}
</i18n>

<template>
<QTable
  row-key="id"
  :columns="columns"
  v-bind="$attrs"
  v-on="$listeners"
/>
</template>

<script lang="ts">
import {
  Component,
  Vue,
} from 'vue-property-decorator';
import { QTable } from 'quasar';
import { Appeal } from '@/types';


@Component({ components: { QTable } })
export default class AppealsTable extends Vue {
  get columns(): NonNullable<QTable['columns']> {
    return [
      {
        label: '№',
        name: 'number',
        field: 'number',
        align: 'right',
      },
      {
        label: this.$t('columns.created_at') as string,
        name: 'created_at',
        field: 'created_at',
        align: 'right',
      },
      {
        label: this.$t('columns.address') as string,
        name: 'address',
        field(appeal: Appeal) {
          const address = appeal.premise?.address;
          return `${address ? `${address}, ` : ' '}${appeal.apartment?.label || ''}`;
        },
        align: 'right',
      },
      {
        label: this.$t('columns.applicant') as string,
        name: 'applicant',
        field(appeal: Appeal) {
          const fullName: string[] = [];
          const {
            first_name,
            last_name,
            patronymic_name,
          } = appeal.applicant;
          if (first_name) {
            fullName.push(first_name);
          }
          if (last_name) {
            fullName.push(last_name);
          }
          if (patronymic_name) {
            fullName.push(patronymic_name);
          }
          return fullName.join(' ');
        },
        align: 'right',
      },
      {
        label: this.$t('columns.description') as string,
        name: 'description',
        field: 'description',
        align: 'right',
      },
      {
        label: this.$t('columns.due_date') as string,
        name: 'due_date',
        field: 'due_date',
        align: 'right',
      },
      {
        label: this.$t('columns.status') as string,
        name: 'status',
        field(appeal: Appeal) {
          return appeal.status.name;
        },
        align: 'right',
      },
    ];
  }
}
</script>
