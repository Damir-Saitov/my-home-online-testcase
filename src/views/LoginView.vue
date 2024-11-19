<i18n>
{
  "ru": {
    "template": {
      "title": "Авторизация",
      "fieldTranslations": {
        "username": "Логин или Телефон",
        "password": "Пароль"
      },
      "send": "Войти"
    },
    "methods": {
      "send": {
        "error": "Не удалось войти"
      }
    }
  }
}
</i18n>

<template>
<div class="full-height flex justify-center content-center login-view">
  <div class="bg-white login-form-container">
    <div class="bg-primary text-center text-white text-bold login-form-container-title">
      {{ $t('template.title') }}
    </div>
    <div>
      <QForm @submit="send">
        <QInput
          :rules="formRules.username"
          :label="fieldTranslations.username"
          v-model="formData.username"
        >
          <template #prepend>
            <QIcon name="call" />
          </template>
        </QInput>

        <QInput
          :rules="formRules.password"
          :label="fieldTranslations.password"
          :type="isPasswordHidden ? 'password' : 'text'"
          v-model="formData.password"
        >
          <template #prepend>
            <QIcon name="lock" />
          </template>

          <template #append>
            <QIcon
              class="cursor-pointer"
              :name="isPasswordHidden ? 'visibility_off' : 'visibility'"
              @click="isPasswordHidden = !isPasswordHidden"
            />
          </template>
        </QInput>

        <div class="mt-28px text-center">
          <QBtn
            color="primary"
            type="submit"
            :label="$t('template.send')"
          />
        </div>
      </QForm>
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
  QForm,
  QInput,
  QIcon,
  QBtn,
} from 'quasar';

import { required } from '@/quasar/formRules';
import type { FormRule } from '@/quasar/formRules';
import { authLoginPost } from '@/api/auth';
import { api } from '@/axios';


@Component({
  components: {
    QForm,
    QIcon,
    QInput,
    QBtn,
  },
})
export default class LoginView extends Vue {
  formData = {
    username: '',
    password: '',
  };

  formRules: Record<keyof LoginView['formData'], FormRule[]> = {
    username: [required],
    password: [required],
  };

  isPasswordHidden = true;

  loading = false;


  get fieldTranslations(): Record<keyof LoginView['formData'], string> {
    return {
      username: this.$t('template.fieldTranslations.username') as string,
      password: this.$t('template.fieldTranslations.password') as string,
    };
  }


  send() {
    if (this.loading) {
      return;
    }

    this.loading = true;
    authLoginPost(this.formData)
      .catch((error) => {
        api.showErrorMessage(
          error,
          this.$t('methods.send.error') as string,
          this.fieldTranslations,
        );
        this.loading = false;
      });
  }
}
</script>

<style lang="scss">
.login-view {
  background-image: url('@/assets/authorization.jpeg');
  background-size: 100% 100%;

  .login-form-container {
    padding: 20px 16px;
    width: 340px;
  }

  .login-form-container-title {
    font-size: 16px;
    margin-top: -36px;
    border-radius: 5px;
    padding-top: 18px;
    padding-bottom: 18px;
    margin-bottom: 50px;
  }
}
</style>
