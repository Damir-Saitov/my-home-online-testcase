import type { AxiosRequestConfig } from 'axios';

import {
  api,
  authLoginUrl,
} from '@/axios';


export type AuthLoginPostData = {
  username: string,
  password: string,
};
export type AuthLoginPostResult = {
  employee_id: number,
  key: string,
};


export function authLoginPost(
  data: AuthLoginPostData,
  config?: AxiosRequestConfig<AuthLoginPostData>,
) {
  return api.post<AuthLoginPostResult>(
    authLoginUrl,
    data,
    Object.assign(config || {}, { $disableTrim: true }),
  );
}
