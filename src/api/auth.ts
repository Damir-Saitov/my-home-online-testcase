import type { AxiosRequestConfig } from 'axios';

import {
  api,
  authLoginUrl,
} from '@/axios';


export type AuthLoginPostData = {
  username: string,
  password: string,
};
export type AuthLoginPostResult = { key: string };


export function authLoginPost(
  data: AuthLoginPostData,
  config?: AxiosRequestConfig<AuthLoginPostData>,
) {
  return api.postForm<AuthLoginPostResult>(
    authLoginUrl,
    data,
    Object.assign(config || {}, { $disableTrim: true }),
  );
}
