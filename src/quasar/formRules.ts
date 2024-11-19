export type FormRule = (value: any) => true | string;


export const required: FormRule = (value) => Boolean(value) || 'Поле обязательно';
