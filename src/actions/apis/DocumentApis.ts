import * as ApiCalls from "../ApiCalls";
import { getCookie } from "../cookieUtils";

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

const uploadDocuments = (payload: { documents: string[]; email: string }) => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;
  return ApiCalls.postResponse(`documents/upload`, payload, token, ucrmKey);
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
};

export default DocumentApis;
