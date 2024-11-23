<i18n>
{
  "ru": {
    "template": {
      "title": "Создание заявки",
      "new": "Новая",
      "create": "Создать",

      "fieldTranslations": {
        "premise_id": "Дом",
        "apartment_id": "Квартира",
        "due_date": "Срок",
        "last_name": "Фамилия",
        "first_name": "Имя",
        "patronymic_name": "Отчество",
        "username": "Телефон",
        "description": "Описание заявки"
      }
    }
  }
}
</i18n>

<template>
<QDialog
  :persistent="loading"
  :value="value"
  @input="updateVisible"
>
  <QCard
    class="px-32px py-24px"
    style="width: 800px; max-width: 100vw;"
  >
    <div class="mb-24px flex">
      <span class="mr-auto text-16px text-bold">
        {{ $t('template.title') }}
      </span>
      <span>
        {{ $t('template.new') }}
      </span>
    </div>

    <QForm @submit="send">
      <div class="mb-32px row q-col-gutter-md">
        <div class="col-4">
          <PremiseSelect
            clearable
            :label="fieldTranslations.premise_id"
            v-model="formData.premise_id"
          />
        </div>

        <div class="col-4">
          <ApartmentSelect
            clearable
            :label="fieldTranslations.apartment_id"
            :disabled="!formData.premise_id"
            :premise_id="formData.premise_id?.value"
            v-model="formData.apartment_id"
          />
        </div>

        <div class="col-4">
          <DateTimePicker
            class="col-4"
            :label="fieldTranslations.due_date"
            v-model="formData.due_date"
          />
        </div>
      </div>

      <div class="mb-32px row q-col-gutter-md">
        <div class="col-3">
          <QInput
            :label="fieldTranslations.last_name"
            v-model="formData.last_name"
          />
        </div>

        <div class="col-3">
          <QInput
            :label="fieldTranslations.first_name"
            v-model="formData.first_name"
          />
        </div>

        <div class="col-3">
          <QInput
            :label="fieldTranslations.patronymic_name"
            v-model="formData.patronymic_name"
          />
        </div>

        <div class="col-3">
          <QInput
            :label="fieldTranslations.username"
            v-model="formData.username"
          />
        </div>
      </div>

      <div class="mb-24px">
        <QInput
          rows="5"
          type="textarea"
          :label="fieldTranslations.description"
          v-model="formData.description"
        />
      </div>

      <div class="text-right">
        <QBtn
          color="primary"
          type="submit"
          :label="$t('template.create')"
        />
      </div>
    </QForm>
  </QCard>
</QDialog>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
} from 'vue-property-decorator';
import {
  QDialog,
  QCard,
  QBtn,
  QInput,
  QSelect,
  QForm,
} from 'quasar';

import type {
  Apartment,
  Option,
  Premise,
} from '@/types';
import type { FormRule } from '@/quasar/formRules';
import DateTimePicker from '@/components/DateTimePicker.vue';
import PremiseSelect from '@/components/PremiseSelect.vue';
import ApartmentSelect from '@/components/ApartmentSelect.vue';


@Component({
  components: {
    QDialog,
    QCard,
    QBtn,
    QSelect,
    QInput,
    QForm,

    PremiseSelect,
    DateTimePicker,
    ApartmentSelect,
  },
})
export default class AddAppealDialog extends Vue {
  @Prop({ required: true })
  value!: boolean;

  formData = {
    premise_id: null as null | Option<Premise['id']>,
    apartment_id: null as null | Option<Apartment['id']>,
    due_date: null as null | string,

    last_name: '',
    first_name: '',
    patronymic_name: '',
    username: '',

    description: '',
  };

  formRules: {[key in keyof typeof this.formData]?: FormRule[]} = {};

  loading = false;


  get fieldTranslations(): Record<keyof typeof this.formData, string> {
    return {
      premise_id: this.$t('template.fieldTranslations.premise_id') as string,
      apartment_id: this.$t('template.fieldTranslations.apartment_id') as string,
      due_date: this.$t('template.fieldTranslations.due_date') as string,
      last_name: this.$t('template.fieldTranslations.last_name') as string,
      first_name: this.$t('template.fieldTranslations.first_name') as string,
      patronymic_name: this.$t('template.fieldTranslations.patronymic_name') as string,
      username: this.$t('template.fieldTranslations.username') as string,
      description: this.$t('template.fieldTranslations.description') as string,
    };
  }


  updateVisible(value: typeof this.value) {
    this.$emit('input', value);
  }

  hide() {
    this.updateVisible(false);
  }

  send() {
    if (this.loading) {
      return;
    }
    this.loading = true;

    // this.$emit('add');
  }
}
</script>

<style scoped>

</style>
