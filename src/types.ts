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


export interface Appeal {
  id: string,
  number: number,
  created_at: string,
  premise: null | {
    address: string,
  },
  apartment: null | {
    id: number,
    label: string,
    number: string,
    object_type: string,
  },
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
