import { get, patch, post } from "@/utils/fetch.util";
import { isDemoEnv } from "../../../config";
import {
  getMockCompany,
  getMockMyAllUCRMs,
  getMockUCRM,
} from "../mock-data/company";

const getCompany = async (companyId: string): Promise<any> => {
  if (isDemoEnv()) {
    return getMockCompany(companyId);
  }
  return get({ url: `/v1/companies/${companyId}` }).then((resp) => resp);
};

const createCompany = async (payload: any) => {
  return post({ url: `/v1/companies`, data: payload }).then((resp) => resp);
};

const updateCompany = async (id: string, payload: any) => {
  return patch({ url: `/v1/companies/${id}`, data: payload }).then(
    (resp) => resp
  );
};

const getAllCompanies = async () => {
  return get({ url: `/v1/companies` }).then((resp) => resp);
};

const getMyAllUCRMs = async () => {
  if (isDemoEnv()) {
    return getMockMyAllUCRMs();
  }
  return get({ url: `/v1/ucrms/me` }).then((resp) => resp);
};

const getUCRM = async (ucrmId: string) => {
  if (isDemoEnv()) {
    return getMockUCRM(ucrmId);
  }
  return get({ url: `/v1/ucrms/${ucrmId}` }).then((resp) => resp);
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
