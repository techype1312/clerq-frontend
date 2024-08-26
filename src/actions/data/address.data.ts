import { get, patch, post } from "@/utils/fetch.util";

const createAddress = async (payload: any) => {
  return post({ url: `/v1/addresses`, data: payload }).then(
    (resp) => resp
  );
};

const updateAddress = async (id: string, payload: any) => {
  return patch({
    url: `/v1/addresses/${id}`,
    data: payload,
  }).then((resp) => resp);
};

const getAddress = async (id: string) => {
  return get({
    url: `/v1/addresses/${id}`,
  }).then((resp) => resp);
};

const AddressApis = {
  createAddress,
  updateAddress,
  getAddress,
};

export default AddressApis;
