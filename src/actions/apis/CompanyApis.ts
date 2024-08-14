import * as ApiCalls from "../ApiCalls";
import { getCookie } from "../cookieUtils";

const getCompany = (id: string) => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;
  return ApiCalls.getResponse(`companies/${id}`, null, token, ucrmKey);
};

const createCompany = (payload: any) => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;
  return ApiCalls.postResponse(`companies`, payload, token, ucrmKey);
};

const updateCompany = (id: string, payload: any) => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;
  return ApiCalls.patchResponse(`companies/${id}`, payload, token, ucrmKey);
};

const getAllCompanies = () => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;
  return ApiCalls.getResponse(`companies`, null, token, ucrmKey);
};

const getMyAllUCRMs = () => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;
  return ApiCalls.getResponse(`ucrms/me`, null, token, ucrmKey);
};

const getUCRM = (id: string) => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;
  return ApiCalls.getResponse(`ucrms/${id}`, null, token, ucrmKey);
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
