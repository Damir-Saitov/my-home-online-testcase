import type { AxiosRequestConfig } from 'axios';

import { api } from '@/axios';
import type { Premise } from '@/types';


export type GeoUserPremisesGetData = { search?: string };
export type GeoUserPremisesGetResult = {
  count: number,
  results: Premise[],
};


export function geoUserPremisesGet(
  data?: GeoUserPremisesGetData,
  config?: AxiosRequestConfig<GeoUserPremisesGetData>,
) {
  return api.get<GeoUserPremisesGetResult>(
    'geo/v2.0/user-premises/',
    Object.assign(config || {}, { params: data }),
  );
}
