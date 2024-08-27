import { get, patch, post } from "@/utils/fetch.util";

const getCompany = async (id: string) => {
  return get({ url: `/v1/companies/${id}` }).then((resp) => resp);
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
  return get({ url: `/v1/ucrms/me` }).then((resp) => resp);
};

const getUCRM = async (id: string) => {
  return get({ url: `/v1/ucrms/${id}` }).then((resp) => resp);
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
