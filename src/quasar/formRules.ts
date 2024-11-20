import { vueI18n } from '@/i18n';


export type FormRule = (value: any) => true | string;


export const required: FormRule = (value) => (
  Boolean(value)
  || vueI18n.t('formRules.required') as string
);
