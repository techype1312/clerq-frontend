import * as ApiCalls from "../ApiCalls";
import { getCookie } from "../cookieUtils";

const createAddress = (payload: any) => {
  return ApiCalls.postResponse(`addresses`, payload, getCookie("token") || "");
};

const updateAddress = (id:string, payload: any) => {
  return ApiCalls.patchResponse(
    `addresses/${id}`,
    payload,
    getCookie("token") || ""
  );
};
const getAddress = (id:string) => {
  return ApiCalls.getResponse(
    `addresses/${id}`,
    null,
    getCookie("token") || ""
  );
};

const OnboardingApis = {
  createAddress,
  updateAddress,
  getAddress
};

export default OnboardingApis;
