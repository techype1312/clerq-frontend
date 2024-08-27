import { convertBase64toFile } from "@/utils/file";
import { DocumentTypes, ILocalFile } from "@/types/file";
import { get, patch, post } from "@/utils/fetch.util";

const getAllDocuments = async (query: {
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: string;
  filters?: Record<string, any>;
}) => {
  const {
    page = 1,
    limit = 10,
    filters = {},
    orderBy = "createdAt",
    order = "Desc",
  } = query;
  const sort = [{ orderBy, order }];
  return get({
    url: `/v1/documents?page=${page}&limit=${limit}&filters=${JSON.stringify(
      filters
    )}&sort=${JSON.stringify(sort)}`,
  }).then((resp) => resp);
};

const shareDocuments = async (payload: {
  documents: string[];
  email: string;
}) => {
  return post({
    url: `/v1/documents/send`,
    data: payload,
  }).then((resp) => resp);
};

const uploadDocuments = async ({
  fileData,
  docType,
  name,
}: {
  fileData: ILocalFile;
  docType: DocumentTypes;
  name: string;
}) => {
  const formData = new FormData();
  const file = convertBase64toFile(fileData.src, fileData.name);
  formData.set("document", file);
  formData.set("name", name);
  formData.set("type", docType);

  return post({
    url: `/v1/documents/upload`,
    data: formData,
    headers: {
      Accept: "multipart/form-data",
      "Content-Type": "multipart/form-data",
    },
  }).then((resp) => resp);
};

const updateDocuments = async (
  id: string,
  payload: {
    docType: DocumentTypes;
    name: string;
    fileData: ILocalFile;
  }
) => {
  const formData = new FormData();
  const file = convertBase64toFile(payload.fileData.src, payload.fileData.name);
  formData.set("document", file);
  formData.set("name", payload.name);
  formData.set("type", payload.docType);

  return patch({
    url: `/v1/documents/upload/${id}`,
    data: formData,
    headers: {
      Accept: "multipart/form-data",
      "Content-Type": "multipart/form-data",
    },
  }).then((resp) => resp);
};

const generateDocuments = async (docType: string) => {
  return post({
    url: `/v1/documents/generate/${docType}`,
  }).then((resp) => resp);
};

const DocumentApis = {
  generateDocuments,
  uploadDocuments,
  getAllDocuments,
  shareDocuments,
  updateDocuments,
};

export default DocumentApis;
