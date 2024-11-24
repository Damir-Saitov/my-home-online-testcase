<i18n>
  {
    "ru": {
      "template": {
        "input": "Ввести"
      }
    }
  }
  </i18n>

<template>
<QInput
  clearable
  label-slot
  :value="value"
  @clear="$emit('input', null)"
  @focus="updateVisible(true)"
>
  <template #label>
    {{ label }}

    <QDialog
      :value="visible"
      @input="updateVisible"
    >
      <QCard
        class="px-32px py-24px"
        style="width: 700px; max-width: 100vw;"
      >
        <div class="flex justify-between">
          <q-date
            flat
            :mask="FRONTEND_DATETIME_FORMAT"
            :value="value"
            @input="setValue"
          />
          <q-time
            flat
            format24h
            :mask="FRONTEND_DATETIME_FORMAT"
            :value="value"
            @input="setValue"
          />
        </div>

        <div class="mt-28px text-right">
          <QBtn
            :label="$t('template.input')"
            @click="hide"
          />
        </div>
      </QCard>
    </QDialog>
  </template>
</QInput>
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
  QDate,
  QTime,
  QInput,
} from 'quasar';

import { FRONTEND_DATETIME_FORMAT } from '@/constants';


@Component({
  components: {
    QDialog,
    QCard,
    QBtn,
    QInput,
    QDate,
    QTime,
  },
})
export default class DateTimePicker extends Vue {
  @Prop({ default: '' })
  label!: string;

  @Prop({ required: true })
  value!: string;

  visible = false;

  FRONTEND_DATETIME_FORMAT = undefined as undefined | typeof FRONTEND_DATETIME_FORMAT;


  setValue(value: typeof this.value) {
    this.$emit('input', value);
  }

  updateVisible(value: typeof this.visible) {
    this.visible = value;
  }

  hide() {
    this.updateVisible(false);
  }


  created() {
    this.FRONTEND_DATETIME_FORMAT = FRONTEND_DATETIME_FORMAT;
  }
}
</script>
