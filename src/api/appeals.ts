import type { AxiosRequestConfig } from 'axios';

import { api } from '@/axios';
import type { Appeal } from '@/types';


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
