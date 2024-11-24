import type { AxiosRequestConfig } from 'axios';

import { api } from '@/axios';
import type {
  Apartment, Appeal, Premise,
} from '@/types';


export type AppealsGetData = {
  page_size: number,
  page: number,
  search?: string,
  premise_id?: NonNullable<Appeal['premise']>['id'],
};
export type AppealsGetResult = {
  count: number,
  results: Appeal[],
};

export function appealsGet(
  data: AppealsGetData,
  config?: AxiosRequestConfig<AppealsGetData>,
) {
  return api.get<AppealsGetResult>(
    'appeals/v1.0/appeals/',
    Object.assign(config || {}, { params: data }),
  );
}


export type AppealsPostData = {
  premise_id?: Premise['id'],
  apartment_id?: Apartment['id'],
  applicant: {
    last_name?: string,
    first_name?: string,
    patronymic_name?: string,
    username?: string,
  },
  description?: string,
  due_date?: string,
};
// export type AppealsPostResult = {};

export function appealsPost(
  data: AppealsPostData,
  config?: AxiosRequestConfig<AppealsPostData>,
) {
  return api.post(
    'appeals/v1.0/appeals/',
    Object.assign(data, { status_id: 1 }),
    config,
  );
}


export type AppealsPatchData = {
  premise_id?: Premise['id'],
  apartment_id?: Apartment['id'],
  applicant: {
    last_name?: string,
    first_name?: string,
    patronymic_name?: string,
    username?: string,
  },
  description?: string,
  due_date?: string,
};
// export type AppealsPatchResult = {};

export function appealsPatch(
  id: Appeal['id'],
  data: AppealsPatchData,
  config?: AxiosRequestConfig<AppealsPatchData>,
) {
  return api.patch(
    `appeals/v1.0/appeals/${id}/`,
    data,
    config,
  );
}
