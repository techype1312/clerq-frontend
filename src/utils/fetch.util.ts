/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestTransformer,
  AxiosResponse,
  AxiosResponseTransformer,
  InternalAxiosRequestConfig,
  Method,
} from "axios";
import axios from "axios";
import { get as lodashGet, isObject, startCase } from "lodash";
import { toast } from "react-toastify";
import {
  getAuthUcrmId,
  getAuthToken,
  getSessionId,
  removeAuthToken,
  setSessionId,
  removeAuthOnboardingStatus,
  removeAuthRefreshToken,
  removeAuthUcrmId,
  removeSessionId,
} from "./session-manager.util";
import localStorage from "./storage/local-storage.util";
import { ErrorProps } from "@/types/general";
import { Servers } from "../../config";

interface SendRequest {
  method?: Method;
  url: string;
  data?: any;
  params?: any;
  headers?: any;
  transformRequest?: AxiosRequestTransformer | AxiosRequestTransformer[];
  transformResponse?: AxiosResponseTransformer | AxiosResponseTransformer[];
}

const apiServerInstance: AxiosInstance = axios.create({
  baseURL: Servers.LiveServer,
  headers: {
    "Content-Type": "application/json",
    platform: "web",
    version: process.env.APP_VERSION,
  },
});

const onError = (err: string | ErrorProps) => {
  toast.error(isObject(err) ? startCase(err.errors.message) : err);
};

const handleResponseError = (error: AxiosError): Promise<AxiosError> => {
  if (error.response && error.response.status === 401) {
    removeAuthToken();
    removeAuthRefreshToken();
    removeAuthUcrmId();
    removeSessionId();
    localStorage.remove("user");
    removeAuthOnboardingStatus();
  }
  const errorData =
    lodashGet(error, "response.data") &&
    lodashGet(error, "response.data.errors") &&
    error.response?.data;
  onError(errorData as ErrorProps);
  return Promise.reject(errorData);
};

const handleResponse = ({ data, headers }: AxiosResponse): AxiosResponse => {
  headers["session-id"] && setSessionId(headers["session-id"]);
  return data;
};

const handleRequestError = (error: AxiosError): Promise<AxiosError> => {
  console.error(`[request error] [${JSON.stringify(error)}]`);
  return Promise.reject(error);
};

const handleRequest = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = getAuthToken();
  const authUcrmId = getAuthUcrmId();
  config.headers = config.headers || {};
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (authUcrmId) config.headers["x_otto_ucrm"] = authUcrmId;
  const sessionId = getSessionId();
  if (sessionId) config.headers["session-id"] = sessionId;
  return config;
};

apiServerInstance.interceptors.request.use(handleRequest, handleRequestError);

apiServerInstance.interceptors.response.use(
  handleResponse,
  handleResponseError
);

function sendRequest({
  url,
  params = {},
  headers = {},
  data = {},
  method,
  transformRequest,
  transformResponse,
}: SendRequest) {
  const config: AxiosRequestConfig<SendRequest> = {
    method,
    url,
    params,
    headers,
    data,
  };
  if (transformRequest) config.transformRequest = transformRequest;
  if (transformResponse) config.transformResponse = transformResponse;
  return apiServerInstance(config);
}

export const get = ({
  url,
  params = {},
  headers = {},
  transformResponse,
}: SendRequest) =>
  sendRequest({
    method: "GET",
    url,
    params,
    headers,
    transformResponse,
  });

export const post = ({
  url,
  data = {},
  headers = {},
  transformRequest,
}: SendRequest) =>
  sendRequest({
    method: "POST",
    url,
    data,
    headers,
    transformRequest,
  });

export const put = ({ url, data = {}, headers = {} }: SendRequest) =>
  sendRequest({
    method: "PUT",
    url,
    data,
    headers,
  });

export const patch = ({ url, data = {}, headers = {} }: SendRequest) =>
  sendRequest({
    method: "PATCH",
    url,
    data,
    headers,
  });

export const remove = ({ url, data = {}, headers = {} }: SendRequest) =>
  sendRequest({
    method: "DELETE",
    url,
    data,
    headers,
  });
