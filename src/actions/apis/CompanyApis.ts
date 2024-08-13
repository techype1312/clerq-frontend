import * as ApiCalls from "../ApiCalls";
import { getCookie } from "../cookieUtils";

const getCompany = (id: string) => {
  const token = getCookie("token") || null;
  return ApiCalls.getResponse(`companies/${id}`, null, token);
};

const createCompany = (payload: any) => {
  const token = getCookie("token") || null;
  return ApiCalls.postResponse(`companies`, payload, token);
};

const updateCompany = (id: string, payload: any) => {
  const token = getCookie("token") || null;
  return ApiCalls.patchResponse(`companies/${id}`, payload, token);
};

const getAllCompanies = () => {
  const token = getCookie("token") || null;
  return ApiCalls.getResponse(`companies`, null, token);
};

const getMyAllUCRMs = () => {
  const token = getCookie("token") || null;
  return ApiCalls.getResponse(`ucrms/me`, null, token);
};

const getUCRM = (id: string) => {
  const token = getCookie("token") || null;
  return ApiCalls.getResponse(`ucrms/${id}`, null, token);
};

const CompanyApis = {
  getCompany,
  createCompany,
  updateCompany,
  getAllCompanies,
  getUCRM,
  getMyAllUCRMs,
};

export default CompanyApis;
