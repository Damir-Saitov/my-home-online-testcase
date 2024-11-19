import axios from 'axios';
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  isCancel as isAxiosCancel,
  isAxiosError,
} from 'axios';
import qs from 'qs';
import type { IStringifyOptions } from 'qs';
import { Notify } from 'quasar';

import {
  router,
  RouteName,
} from '@/router';
import {
  store,
  StoreActions,
} from '@/store';
import { sliceWithEllipsis } from '@/utils/sliceWithEllipsis';


// Пустой сигнал аборта
function returnFalse() {
  return false;
}
// eslint-disable-next-line @typescript-eslint/no-empty-function
function efunction() {}
const eSignal = Object.freeze({
  aborted: false,
  onabort: efunction,
  reason: undefined,
  throwIfAborted: efunction,
  any: () => eSignal,
  addEventListener: efunction,
  removeEventListener: efunction,
  dispatchEvent: returnFalse,
}) as AbortSignal;

const eAbortController = Object.freeze({
  abort: efunction,
  signal: eSignal,
}) as AbortController;


// Дополнительные поля и функции
function isCancel(error: unknown): boolean {
  return (
    !error
    || (error as Error).name === 'AbortError'
    || axios.isCancel(error)
  );
}

function deepTrimInPlace<T>(value: T) {
  if (value && typeof value === 'object') {
    for (const [key, _value] of Object.entries(value)) {
      const type = typeof _value;
      if (_value && type === 'object') {
        deepTrimInPlace(_value);
      } else if (type === 'string') {
        // eslint-disable-next-line no-param-reassign
        (value as Record<string, unknown>)[key] = (_value as string).trim();
      }
    }
  }
}
function autoTrimInterseption(requestConfig: InternalAxiosRequestConfig) {
  if (
    !requestConfig.$disableTrim
    && requestConfig.data
    && !(requestConfig.data instanceof FormData)
  ) {
    deepTrimInPlace(requestConfig.data);
  }
  return requestConfig;
}


function removeEmptyUrlSearchParamsInterseption(requestConfig: InternalAxiosRequestConfig) {
  if (!requestConfig.$disableRemoveEmptyUrlSearchParams && requestConfig.params) {
    for (const [name, param] of Object.entries(requestConfig.params)) {
      if (!param && param !== 0) {
        // eslint-disable-next-line no-param-reassign
        delete requestConfig.params[name];
      }
    }
  }
  return requestConfig;
}


// Парсинг ошибки
function parseServerError(status?: number): string {
  const statusString = status ? (` ${status}`) : '';
  return `серверная ошибка${statusString}. Ведутся технические работы`;
}
function getErrorMessageFromArray(errors: string[], field?: string) {
  const result: string[] = [];
  for (const error of errors) {
    if (error) {
      result.push(error);
    }
  }
  return `${field}: ${result.join(', ')}`;
}

type MultipleErrorsData = {
  [errorName: string]: string[];
};
function parseMultipleErrorsData(
  data: MultipleErrorsData,
  fieldTranslation?: Record<string, string>,
) {
  const result: string[] = [];
  for (const [field, errors] of Object.entries(data)) {
    if (!Array.isArray(errors)) {
      continue;
    }
    result.push(getErrorMessageFromArray(errors, fieldTranslation?.[field] || field));
  }
  return result.join('\n');
}

function parseErrorData(data: unknown, fieldTranslation?: Record<string, string>): string {
  if (data && typeof data === 'object') {
    if (Array.isArray(data)) {
      return getErrorMessageFromArray(data);
    }

    const _data = data as Record<string, unknown>;
    if ('detail' in _data) {
      if ('data' in _data) {
        if (
          typeof _data.data === 'object'
          && _data.data
          && 'non_field_errors' in _data.data
        ) {
          const non_field_errors = (_data.data as { non_field_errors: string[] }).non_field_errors;
          return (
            Array.isArray(non_field_errors)
              ? non_field_errors.join('\n')
              : String(non_field_errors)
          );
        }

        return parseMultipleErrorsData(
          _data.data as MultipleErrorsData,
          fieldTranslation,
        );
      }
      return String((data as { detail: unknown }).detail);
    }

    return parseMultipleErrorsData(data as MultipleErrorsData, fieldTranslation);
  }

  return sliceWithEllipsis(String(data), 100);
}

function parseError(
  error: unknown,
  premessage?: string,
  fieldTranslation?: Record<string, string>,
) {
  let message = 'программная ошибка, пожалуйста, обратитесь в поддержку';
  if (axios.isAxiosError(error)) {
    if (error.response && error.response.status < 500) {
      try {
        message = parseErrorData(error.response.data, fieldTranslation);
      } catch (parsingError) {
        console.error(
          'Ошибка при обработке ошибки от сервера:',
          parsingError,
        );
        console.error(
          'Неверный формат ответ от сервера:',
          error.response.data,
        );
        message = parseServerError();
      }
    } else {
      message = parseServerError(error.response?.status);
    }
  } else {
    const errorText = String((error as Error)?.stack || error);
    // Добавить 100 символов текста ошибки
    message = `${message} "${sliceWithEllipsis(errorText, 100)}"`;
    console.error('Программная ошибка:', errorText);
  }

  return premessage
    ? (`${premessage}: ${message}`)
    : message;
}


function showErrorMessage(
  error: Parameters<typeof parseError>['0'],
  premessage: Parameters<typeof parseError>['1'],
  fieldTranslation?: Parameters<typeof parseError>['2'],
) {
  Notify?.create({
    position: 'top',
    timeout: 5000,
    type: 'negative',
    message: parseError(
      error,
      premessage,
      fieldTranslation,
    ),
  });
}


// Примеси
function logError(error: unknown) {
  if (!isCancel(error)) {
    console.log(error);
  }
  return Promise.reject(error);
}

export const authLoginUrl = 'auth/login/';
const ignoredUrls = Object.freeze([authLoginUrl]);

async function nullErrorIfCancelOrUnauthorized(error: unknown) {
  // Если это отмена запроса, то ошибка пустая
  if (axios.isCancel(error)) {
    // eslint-disable-next-line no-throw-literal
    throw undefined;
  }

  // Если это ошибка авторизации, то ошибка пустая
  if (axios.isAxiosError(error)
    && (
      error.response?.status === 401
      || error.response?.status === 403
    )
    && (
      error.config?.url
      && !ignoredUrls.includes(error.config.url)
    )
  ) {
    Notify?.create({
      group: 'unauthorized',
      position: 'top',
      timeout: 5000,
      type: 'negative',
      message: 'Учётные данные не были предоставлены',
    });
    await store.dispatch(StoreActions.logout);
    if (router.currentRoute.name !== 'Логин') {
      router.push({ name: RouteName.Login });
    }
    // eslint-disable-next-line no-throw-literal
    throw undefined;
  }

  throw error;
}


export interface AxiosInstanceExtended extends AxiosInstance {
  isAxiosCancel: typeof isAxiosCancel;
  isAxiosError: typeof isAxiosError;
  isCancel: typeof isCancel;
  parseError: typeof parseError;
  showErrorMessage: typeof showErrorMessage;
  eAbortController: typeof eAbortController;
  setAuthorization: (accessToken: string) => void;
  removeAuthorization: () => void;
  // isAuthorized(): boolean;
}

export function createAxiosInstance(
  params: Parameters<typeof axios['create']>['0'],
): AxiosInstanceExtended {
  const result = axios.create(params) as AxiosInstanceExtended;

  result.interceptors.request.use(autoTrimInterseption);
  result.interceptors.request.use(removeEmptyUrlSearchParamsInterseption);
  result.interceptors.response.use(undefined, logError);
  result.interceptors.response.use(undefined, nullErrorIfCancelOrUnauthorized);

  result.isAxiosCancel = axios.isCancel;
  result.isAxiosError = axios.isAxiosError;
  result.isCancel = isCancel;
  result.parseError = parseError;
  result.showErrorMessage = showErrorMessage;
  result.eAbortController = eAbortController;

  result.setAuthorization = (accessToken: string) => {
    result.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  };

  result.removeAuthorization = () => {
    delete result.defaults.headers.common.Authorization;
  };

  return result;
}


const qsOptions: IStringifyOptions = { arrayFormat: 'comma' };
export const api = createAxiosInstance({
  baseURL: new URL('api', process.env.VUE_APP_BASE_URL).toString(),
  timeout: 300000,
  paramsSerializer: {
    encode(params) {
      return qs.stringify(params, qsOptions);
    },
  },
});

declare module 'axios' {
  export interface AxiosRequestConfig {
    $disableTrim?: boolean,
    $disableRemoveEmptyUrlSearchParams?: boolean,
  }
}
