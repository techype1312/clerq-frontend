import axios from "axios";
import { Servers } from "../../config";
import { toast } from "react-toastify";
import AuthApis from "./apis/AuthApis";
import Cookies from "js-cookie";

const BaseUrl = Servers.LiveServer;

const getHeader = (formData: any, token: string | null) => {
  const headers = {
    Accept: formData ? "multipart/form-data" : "application/json",
    "Content-Type": formData ? "multipart/form-data" : "application/json",
    Authorization: "",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// const getUpdatedHeader = async (formData: any) => {
//   return {
//     Accept: formData
//       ? "multipart/form-data"
//       : "application/x-www-form-urlencoded; charset=UTF-8",
//     "Content-Type": formData
//       ? "multipart/form-data"
//       : "application/x-www-form-urlencoded; charset=UTF-8",
//   };
// };

export const getResponse = async (
  url: string,
  params: any,
  token: string | null,
  retry: boolean = false
) => {
  const URL = BaseUrl + url;
  const headers = getHeader(null, token);
  return axios(URL, {
    params,
    method: "GET",
    headers: headers,
    withCredentials: false,
  })
    .then((response) => response)
    .catch(async (error: any): Promise<any> => {
      if (error) {
        if (error.response?.status === 401) {
          const res = await AuthApis.verifyRefreshToken();
          if (res && res?.data && res?.status === 200) {
            Cookies.set("token", res?.data?.token);
            if (!retry) {
              // Retry the request with the new token
              return getResponse(url, params, res?.data?.token, true);
            }
          } else {
            localStorage.clear();
            Cookies.remove("token");
            Cookies.remove("refreshToken");
            Cookies.remove("userType");
            window.location.href = "/";
            return res;
          }
        } else if (error.response) {
          toast.error(error.response.data.message);
        }
      }
      return error;
    });
};
export const putResponse = async (
  url: string,
  payload: any,
  token: string,
  retry: boolean = false
) => {
  const URL = BaseUrl + url;
  return axios(URL, {
    method: "PUT",
    headers: await getHeader(false, token),
    data: payload,
  })
    .then((response) => response)
    .catch(async (error: any): Promise<any> => {
      if (error) {
        if (error?.response?.status === 401) {
          const res = await AuthApis.verifyRefreshToken();
          if (res && res?.data && res?.status === 200) {
            Cookies.set("token", res?.data?.token);
            if (!retry) {
              // Retry the request with the new token
              return putResponse(url, payload, res?.data?.token, true);
            }
          } else if (
            (res?.status === 401 || res?.status === 403) &&
            !res.response.success
          ) {
            localStorage.clear();
            Cookies.remove("token");
            Cookies.remove("refreshToken");
            Cookies.remove("userType");
            window.location.href = "/";
          }
        } else if (error.response) {
          toast.error(error.response.data.message);
        }
      }
      return error;
    });
};

export const deleteResponse = async (
  url: string,
  params: any,
  token: string,
  retry: boolean = false
) => {
  const URL = BaseUrl + url;
  return axios(URL, {
    params,
    method: "DELETE",
    headers: await getHeader(false, token),
  })
    .then((response) => response)
    .catch(async (error: any): Promise<any> => {
      if (error) {
        if (error.response?.status === 401) {
          const res = await AuthApis.verifyRefreshToken();
          if (res && res?.data && res?.status === 200) {
            Cookies.set("token", res?.data?.token);
            if (!retry) {
              // Retry the request with the new token
              return deleteResponse(url, params, res?.data?.token, true);
            }
          } else if (
            (res?.status === 401 || res?.status === 403) &&
            !res.response.success
          ) {
            localStorage.clear();
            Cookies.remove("token");
            Cookies.remove("refreshToken");
            Cookies.remove("userType");
            window.location.href = "/";
          }
        } else if (error.response) {
          toast.error(error.response.data.message);
        }
      }
      return error;
    });
};

export const postResponse = async (
  url: string,
  payload: any,
  token: string | null,
  retry: boolean = false
) => {
  const URL = BaseUrl + url;
  let headers;
  if (token) {
    headers = getHeader(false, token);
  }
  return axios(URL, {
    method: "POST",
    headers: headers,
    data: payload,
  })
    .then((response) => response)
    .catch(async (error: any): Promise<any> => {
      if (error) {
        if (error?.response?.status === 401 && url !== "auth/refresh") {
          const res = await AuthApis.verifyRefreshToken();
          if (res && res?.data && res?.status === 200) {
            Cookies.set("token", res?.data?.token);
            Cookies.set("refreshToken", res?.data?.refreshToken, {
              expires: res?.data?.expiresIn,
            });
            Cookies.set(
              "onboarding_completed",
              res?.data?.user?.onboarding_completed ? "true" : "false"
            );
            if (!retry) {
              // Retry the request with the new token
              return postResponse(url, payload, res?.data?.token, true);
            }
          } else if (
            (res?.status === 401 || res?.status === 403) &&
            !res.response.success
          ) {
            localStorage.clear();
            Cookies.remove("token");
            Cookies.remove("refreshToken");
            Cookies.remove("userType");
            window.location.href = "/";
          }
        } else if (error?.response?.status === 400) {
          toast.error(error.response.data.error.message);
        } else if (error?.response?.status === 422) {
          let toastError = error.response.data.errors;
          toast.error(
            Object.keys(toastError)[0] +
              ": " +
              toastError[Object.keys(toastError)[0]]
          );
        } else if (error.response) {
          toast.error(error.response.data.message);
        }
      } else return error;
    });
};

export const postResponseUpdated = async (
  url: string,
  payload: any,
  token: string,
  retry: boolean = false
) => {
  const URL = BaseUrl + url;
  const headers = getHeader(false, token);
  return axios(URL, {
    method: "POST",
    headers: headers,
    data: payload,
  })
    .then((response) => response)
    .catch(async (error) => {
      if (error) {
        if (error.response?.status === 401 && !error.response.success) {
          const res = await AuthApis.verifyRefreshToken();
          if (res && res?.data && res?.status === 200) {
            Cookies.set("token", res?.data?.token);
            if (!retry) {
              // Retry the request with the new token
              return postResponse(url, payload, res?.data?.token, true);
            }
          } else if (
            (res?.status === 401 || res?.status === 403) &&
            !res.response.success
          ) {
            localStorage.clear();
            Cookies.remove("token");
            Cookies.remove("refreshToken");
            Cookies.remove("userType");
            window.location.href = "/";
          }
        }
      } else if (error.response) {
        toast.error(error.response.data.message);
      }
      return error;
    });
};

export const patchResponse = async (
  url: string,
  payload: any,
  token: string | null,
  retry: boolean = false
) => {
  const URL = BaseUrl + url;
  const headers = getHeader(false, token);
  return axios(URL, {
    method: "PATCH",
    headers: headers,
    data: payload,
  })
    .then((response) => response)
    .catch(async (error: any): Promise<any> => {
      if (error.response) {
        if (error.response?.status === 401 && !error.response.success) {
          const res = await AuthApis.verifyRefreshToken();
          if (res && res?.data && res?.status === 200) {
            Cookies.set("token", res?.data?.token);
            if (!retry) {
              // Retry the request with the new token
              return patchResponse(url, payload, res?.data?.token, true);
            }
          } else if (
            (res?.status === 401 || res?.status === 403) &&
            !res.response.success
          ) {
            localStorage.clear();
            Cookies.remove("token");
            Cookies.remove("refreshToken");
            Cookies.remove("userType");
            window.location.href = "/";
          }
        }
      } else {
        toast.error(error.response.data.message);
      }
      return error;
    });
};
export const patchResponseFormData = async (
  url: string,
  payload: any,
  token: string,
  retry: boolean = false
) => {
  const URL = BaseUrl + url;
  const headers = getHeader(true, token);
  return axios(URL, {
    method: "PATCH",
    headers: headers,
    data: payload,
  })
    .then((response) => response)
    .catch(async (error) => {
      if (error.response) {
        if (error.response?.status === 401 && !error.response.success) {
          const res = await AuthApis.verifyRefreshToken();
          if (res && res?.data && res?.status === 200) {
            Cookies.set("token", res?.data?.token);
            if (!retry) {
              // Retry the request with the new token
              return patchResponse(url, payload, res?.data?.token, true);
            }
          } else if (
            (res?.status === 401 || res?.status === 403) &&
            !res.response.success
          ) {
            localStorage.clear();
            Cookies.remove("token");
            Cookies.remove("refreshToken");
            Cookies.remove("userType");
            window.location.href = "/";
          }
        }
      } else {
        toast.error(error.response.data.message);
      }
      return error;
    });
};

export const postResponseFormData = async (
  url: string,
  payload: any,
  retry: boolean = false
) => {
  const URL = BaseUrl + url;
  const headers = getHeader(true, null);
  return axios
    .post(URL, payload, { headers: headers })
    .then((response) => response)
    .catch(async (error: any): Promise<any> => {
      if (error.response) {
        if (error.response?.status === 401) {
          const res = await AuthApis.verifyRefreshToken();
          if (res && res?.data && res?.status === 200) {
            Cookies.set("token", res?.data?.token);
            if (!retry) {
              // Retry the request with the new token
              return postResponseFormData(url, payload, true);
            }
          } else if (
            (res?.status === 401 || res?.status === 403) &&
            !res.response.success
          ) {
            localStorage.clear();
            Cookies.remove("token");
            Cookies.remove("refreshToken");
            Cookies.remove("userType");
            window.location.href = "/";
          }
        }
      } else if (error.response) {
        toast.error(error.response.data.message);
      }
      return error;
    });
};

interface SearchParams {
  searchKeyword?: string;
  industry?: string[];
  certification?: string[];
  salary?: {
    from?: number;
    to?: number;
  };
}

export const getResponseWithQueryParams = async (
  url: string,
  params: any,
  token: string,
  retry: boolean = false
) => {
  const URL = BaseUrl + url;

  let newFilters = {};
  const paramsString: any = {
    page: params.page || 1,
    limit: params.limit || 10,
    filters: newFilters,
  };
  if (params.sort) {
    paramsString.sort = JSON.stringify(params.sort);
  }
  console.log(params?.filters);
  if (params.amountFilter && Object.keys(params.amountFilter).length !== 0) {
    const amount = params.amountFilter.value;
    let amount_from = amount.split("-")[0];
    let amount_to = amount.split("-")[1];
    if (amount_from === amount) {
      amount_from = amount.split("+")[0];
      amount_to = null;
    }
    newFilters = {
      ...newFilters,
      ...(amount_from && amount_to
        ? { amount_from, amount_to }
        : amount_from
        ? { amount_from }
        : {}),
    };
  }

  console.log(params.filters.find((filter: any) => filter.id === "category"));

  if (
    params.filters &&
    params.filters.find((filter: any) => filter.id === "category")
  ) {
    const category = params?.filters.filter(
      (filter: any) => filter.id === "category"
    )[0].value;
    newFilters = {
      ...newFilters,
      ...(category ? { category } : {}),
    };
  }

  if (
    params.filters &&
    params?.filters.find((filter: any) => filter.id === "sub_categories")
  ) {
    const sub_categories = params?.filters.filter(
      (filter: any) => filter.id === "sub_categories"
    )[0].value;
    console.log(sub_categories);
    newFilters = {
      ...newFilters,
      ...(sub_categories ? { sub_categories } : {}),
    };
  }

  if (params.dateFilter) {
    newFilters = {
      ...newFilters,
      ...(params.dateFilter && {
        created_at_from: params.dateFilter.from,
        created_at_to: params.dateFilter.to,
      }),
    };
  }

  paramsString.filters = JSON.stringify(newFilters);

  const headers: any = getHeader(token !== null, token);
  return axios(URL, {
    params: paramsString,
    method: "GET",
    headers: headers,
  })
    .then((response) => response)
    .catch(async (error: any): Promise<any> => {
      if (error) {
        if (error.response?.status === 401) {
          const res = await AuthApis.verifyRefreshToken();
          if (res && res?.data && res?.status === 200) {
            Cookies.set("token", res?.data?.token);
            if (!retry) {
              // Retry the request with the new token
              return getResponseWithQueryParams(
                url,
                params,
                res?.data?.token,
                true
              );
            }
          } else if (
            (res?.status === 401 || res?.status === 403) &&
            !res.response.success
          ) {
            localStorage.clear();
            Cookies.remove("token");
            Cookies.remove("refreshToken");
            Cookies.remove("userType");
            window.location.href = "/";
          }
        }
      } else if (error.response) {
        toast.error(error.response.data.message);
      }
      return error;
    });
};
