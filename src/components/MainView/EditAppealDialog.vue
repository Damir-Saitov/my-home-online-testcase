<i18n>
{
  "ru": {
    "template": {
      "title": "Заявка №{number} (от {created})",
      "new": "Новая",
      "send": "Сохранить",

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
    },
    "methods": {
      "send": {
        "success": "Заявка сохранена",
        "error": "Не удалось сохранить заявку"
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
        {{ $t('template.title', {
          number: appeal.number,
          created: appeal.created_at,
        }) }}
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
          :label="$t('template.send')"
          :loading="loading"
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
  Watch,
} from 'vue-property-decorator';
import {
  QDialog,
  QCard,
  QBtn,
  QInput,
  QSelect,
  QForm,
  Notify,
  date,
} from 'quasar';

import type {
  Apartment,
  Appeal,
  Option,
  Premise,
} from '@/types';
import DateTimePicker from '@/components/DateTimePicker.vue';
import PremiseSelect from '@/components/PremiseSelect.vue';
import ApartmentSelect from '@/components/ApartmentSelect.vue';
import { appealsPatch } from '@/api/appeals';
import { api } from '@/axios';
import {
  BACKEND_DATETIME_FORMAT,
  FRONTEND_DATETIME_FORMAT,
} from '@/constants';


interface FormDataType {
  premise_id: null | Option<Premise['id']>,
  apartment_id: null | Option<Apartment['id']>,
  due_date: null | string,
  last_name: string,
  first_name: string,
  patronymic_name: string,
  username: string,
  description: string,
}


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

  @Prop({ required: true })
  appeal!: Appeal;

  formData = this.initFormData();

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
    if (!value) {
      this.formData = this.initFormData();
    }
  }

  hide() {
    this.updateVisible(false);
  }

  initFormData(): FormDataType {
    const appeal = this.appeal;
    const premise = appeal.premise;
    const apartment = appeal.apartment;
    const applicant = appeal.applicant;
    return {
      premise_id: (
        premise
          ? {
            value: premise.id,
            label: premise.full_address,
          }
          : null
      ),
      apartment_id: (
        apartment
          ? {
            value: apartment.id,
            label: apartment.label,
          }
          : null
      ),
      due_date: appeal.due_date ? date.formatDate(appeal.due_date, FRONTEND_DATETIME_FORMAT) : null,
      description: appeal.description,

      first_name: applicant.first_name,
      last_name: applicant.last_name,
      patronymic_name: applicant.patronymic_name,
      username: applicant.username,
    };
  }

  @Watch('appeal')
  updateFormData() {
    this.formData = this.initFormData();
  }

  send() {
    if (this.loading) {
      return;
    }
    this.loading = true;

    appealsPatch(
      this.appeal.id,
      {
        premise_id: this.formData.premise_id?.value,
        apartment_id: this.formData.apartment_id?.value,
        due_date: (
          this.formData.due_date
            ? date.formatDate(
              date.extractDate(this.formData.due_date, FRONTEND_DATETIME_FORMAT),
              BACKEND_DATETIME_FORMAT,
            )
            : undefined
        ),
        description: this.formData.description,
        applicant: {
          last_name: this.formData.last_name,
          first_name: this.formData.first_name,
          patronymic_name: this.formData.patronymic_name,
          username: this.formData.username,
        },
      },
    )
      .then(() => {
        this.$emit('edit');
        this.loading = false;
        Notify.create({
          position: 'top',
          timeout: 3000,
          type: 'positive',
          message: this.$t('methods.send.success') as string,
        });
        this.hide();
      })
      .catch((error) => {
        api.showErrorMessage(error, this.$t('methods.send.error') as string);
        this.loading = false;
      });
  }
}
</script>
