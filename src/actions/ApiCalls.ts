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
  const headers = getHeader(token !== null, token);
  return axios(URL, {
    params,
    method: "GET",
    headers: headers,
    withCredentials: true,
  })
    .then((response) => response)
    .catch(async (error: any): Promise<any> => {
      if (error) {
        if (error.response.status === 401) {
          const res = await AuthApis.verifyRefreshToken();
          console.log(res);
          if (res && res?.data && res.status === 202) {
            Cookies.set("jwtToken", res?.data?.data?.accessToken);
            if (!retry) {
              // Retry the request with the new token
              return getResponse(
                url,
                params,
                res?.data?.data?.accessToken,
                true
              );
            }
          } else {
            localStorage.clear();
            Cookies.remove("jwtToken");
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
          if (res && res?.data && res.status === 202) {
            Cookies.set("jwtToken", res?.data?.data?.accessToken);
            if (!retry) {
              // Retry the request with the new token
              return putResponse(
                url,
                payload,
                res?.data?.data?.accessToken,
                true
              );
            }
          } else if (res.status === 401 && !res.response.success) {
            localStorage.clear();
            Cookies.remove("jwtToken");
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
        if (error.response.status === 401) {
          const res = await AuthApis.verifyRefreshToken();
          if (res && res?.data && res.status === 202) {
            Cookies.set("jwtToken", res?.data?.data?.accessToken);
            if (!retry) {
              // Retry the request with the new token
              return deleteResponse(
                url,
                params,
                res?.data?.data?.accessToken,
                true
              );
            }
          } else if (res.status === 401 && !res.response.success) {
            localStorage.clear();
            Cookies.remove("jwtToken");
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
        if (
          error.response.status === 401 &&
          url !== "v1/users/verify-refresh-token" &&
          url !== "v1/users/"
        ) {
          const res = await AuthApis.verifyRefreshToken();
          if (res && res?.data && res.status === 202) {
            Cookies.set("jwtToken", res?.data?.data?.accessToken);
            if (!retry) {
              // Retry the request with the new token
              return postResponse(
                url,
                payload,
                res?.data?.data?.accessToken,
                true
              );
            }
          } else if (res.status === 401 && !res.response.success) {
            localStorage.clear();
            Cookies.remove("jwtToken");
            Cookies.remove("refreshToken");
            Cookies.remove("userType");
            window.location.href = "/";
          }
        }
        else if (error.response.status === 400) {
          toast.error(error.response.data.error.message);
        }
      } else if (error.response) {
        toast.error(error.response.data.message);
      }
      return error;
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
        if (error.response.status === 401 && !error.response.success) {
          const res = await AuthApis.verifyRefreshToken();
          if (res && res?.data && res.status === 202) {
            Cookies.set("jwtToken", res?.data?.data?.accessToken);
            if (!retry) {
              // Retry the request with the new token
              return postResponse(
                url,
                payload,
                res?.data?.data?.accessToken,
                true
              );
            }
          } else if (res.status === 401 && !res.response.success) {
            localStorage.clear();
            Cookies.remove("jwtToken");
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
        if (error.response.status === 401 && !error.response.success) {
          const res = await AuthApis.verifyRefreshToken();
          if (res && res?.data && res.status === 202) {
            Cookies.set("jwtToken", res?.data?.data?.accessToken);
            if (!retry) {
              // Retry the request with the new token
              return patchResponse(
                url,
                payload,
                res?.data?.data?.accessToken,
                true
              );
            }
          } else if (res.status === 401 && !res.response.success) {
            localStorage.clear();
            Cookies.remove("jwtToken");
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
        if (error.response.status === 401 && !error.response.success) {
          const res = await AuthApis.verifyRefreshToken();
          if (res && res?.data && res.status === 202) {
            Cookies.set("jwtToken", res?.data?.data?.accessToken);
            if (!retry) {
              // Retry the request with the new token
              return patchResponse(
                url,
                payload,
                res?.data?.data?.accessToken,
                true
              );
            }
          } else if (res.status === 401 && !res.response.success) {
            localStorage.clear();
            Cookies.remove("jwtToken");
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
        if (error.response.status === 401) {
          const res = await AuthApis.verifyRefreshToken();
          if (res && res?.data && res.status === 202) {
            Cookies.set("jwtToken", res?.data?.data?.accessToken);
            if (!retry) {
              // Retry the request with the new token
              return postResponseFormData(url, payload, true);
            }
          } else if (res.status === 401 && !res.response.success) {
            localStorage.clear();
            Cookies.remove("jwtToken");
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
  // && params.industry[0] !== "All"
  //&& params.certification[0] !== "All"
  const paramsString: any = {
    ...(params.searchKeyWord && { fullName: params.searchKeyWord }),
    ...(params.industry &&
      params.industry.length > 0 && { industry: params.industry.join(",") }),
    ...(params.certification &&
      params.certification.length > 0 && {
        certification: params.certification.join(","),
      }),
    ...(params.salary &&
      (params.salary.from || params.salary.to) &&
      (params.salary.from > 0 || params.salary.to < 501) && {
        salaryFrom: params.salary.from,
        salaryTo: params.salary.to || 0,
      }),
    ...(params.experience &&
      (params.experience.from || params.experience.to) &&
      (params.experience.from > 0 || params.experience.to < 30) && {
        experienceFrom: params.experience.from || 0,
        experienceTo: params.experience.to || 0,
      }),
  };
  console.log("Search Params", paramsString, params);
  const headers = getHeader(token !== null, token);
  return axios(URL, {
    params: paramsString,
    method: "GET",
    headers: headers,
  })
    .then((response) => response)
    .catch(async (error: any): Promise<any> => {
      if (error) {
        if (error.response.status === 401) {
          const res = await AuthApis.verifyRefreshToken();
          if (res && res?.data && res.status === 202) {
            Cookies.set("jwtToken", res?.data?.data?.accessToken);
            if (!retry) {
              // Retry the request with the new token
              return getResponseWithQueryParams(
                url,
                params,
                res?.data?.data?.accessToken,
                true
              );
            }
          } else if (res.status === 401 && !res.response.success) {
            localStorage.clear();
            Cookies.remove("jwtToken");
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
