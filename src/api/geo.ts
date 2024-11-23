import type { AxiosRequestConfig } from 'axios';

import { api } from '@/axios';
import type {
  Apartment,
  Premise,
} from '@/types';


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


export type GeoApartmentsGetData = {
  search?: string,
  premise_id: string,
};
export type GeoApartmentsGetResult = {
  count: number,
  results: Apartment[],
};


export function geoApartmentsGet(
  data?: GeoApartmentsGetData,
  config?: AxiosRequestConfig<GeoApartmentsGetData>,
) {
  return api.get<GeoApartmentsGetResult>(
    'geo/v1.0/apartments/',
    Object.assign(config || {}, { params: data }),
  );
}
