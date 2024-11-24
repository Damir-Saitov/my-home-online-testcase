import type { QTable } from 'quasar';


type QTablePagination = NonNullable<QTable['pagination']>;

export interface Pagination {
  page: NonNullable<QTablePagination['page']>,
  rowsPerPage: NonNullable<QTablePagination['rowsPerPage']>,
  rowsNumber: NonNullable<QTablePagination['rowsNumber']>,
}

export interface Option<T> {
  label: string,
  value: T,
}


export interface Premise {
  id: string,
  title: string,
  kind: string,
  thoroughfare: {
    id: string,
    name: string,
    kind: string,
  },
  locality: {
    id: string,
    name: string,
    kind: string,
    phone_code1: string,
    phone_code2: string,
  },
  address: string,
  cadaster_address: string,
  full_address: string,
  short_address: string,
  manage_organization: {
    id: number,
    name: string,
  },
  area: string,
  apartments_area: string,
  apartments_count: number,
  cadaster_numbers: string[],
  customer_premise_id: number,
  is_deleted: boolean,
}

export interface Apartment {
  id: number,
  label: string,
  number: string,
  object_type: string,
}

export interface Appeal {
  id: string,
  number: number,
  created_at: null | string,
  premise: null | Premise,
  apartment: null | Apartment,
  applicant: {
    email: string,
    first_name: string,
    last_name: string,
    patronymic_name: string,
    username: string,
  },
  description: string,
  due_date: string,
  status: {
    id: number,
    name: string,
    is_red_details: boolean,
    full_details: string,
    short_details: string,
  },
}
