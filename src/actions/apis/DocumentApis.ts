import { convertBase64toFile } from "@/utils/file";
import * as ApiCalls from "../ApiCalls";
import { getCookie } from "../cookieUtils";
import { DocumentTypes } from "@/utils/types/document";

const getAllDocuments = (query: {
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
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;
  const sort = [{ orderBy, order }];
  return ApiCalls.getResponse(
    `documents?page=${page}&limit=${limit}&filters=${JSON.stringify(
      filters
    )}&sort=${JSON.stringify(sort)}`,
    null,
    token,
    ucrmKey
  );
};

const shareDocuments = (payload: { documents: string[]; email: string }) => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;
  return ApiCalls.postResponse(`documents/send`, payload, token, ucrmKey);
};

interface IFile {
  id: number;
  src: string;
  name: string;
  size: string;
  type: string;
}

const uploadDocuments = ({
  fileData,
  docType,
  name,
}: {
  fileData: IFile;
  docType: DocumentTypes;
  name: string;
}) => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;

  const formData = new FormData();
  const file = convertBase64toFile(fileData.src, fileData.name);
  formData.set("document", file);
  formData.set("name", name);
  formData.set("type", docType);

  return ApiCalls.postResponseFormData(
    `documents/upload`,
    formData,
    token,
    ucrmKey
  );
};

const updateDocuments = (
  id: string,
  payload: {
    docType: DocumentTypes;
    name: string;
    fileData: IFile;
  }
) => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;

  const formData = new FormData();
  const file = convertBase64toFile(payload.fileData.src, payload.fileData.name);
  formData.set("document", file);
  formData.set("name", payload.name);
  formData.set("type", payload.docType);

  return ApiCalls.patchResponseFormData(
    `documents/upload/${id}`,
    formData,
    token,
    ucrmKey
  );
};

const generateDocuments = (docType: string) => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;
  return ApiCalls.postResponse(
    `documents/generate/${docType}`,
    null,
    token,
    ucrmKey
  );
};

const DocumentApis = {
  generateDocuments,
  uploadDocuments,
  getAllDocuments,
  shareDocuments,
  updateDocuments,
};

export default DocumentApis;
