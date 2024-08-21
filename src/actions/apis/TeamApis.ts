import * as ApiCalls from "../ApiCalls";
import { getCookie } from "../cookieUtils";

const getAllTeamMembers = (query: {
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
    `ucrms?page=${page}&limit=${limit}&filters=${JSON.stringify(
      filters
    )}&sort=${JSON.stringify(sort)}`,
    null,
    token,
    ucrmKey
  );
};

const updateTeamMember = (id: string, payload: any) => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;
  return ApiCalls.patchResponse(`ucrms/${id}`, payload, token, ucrmKey);
};

const deactivateTeamMember = (id: string) => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;
  return ApiCalls.patchResponse(`ucrms/deactivate/${id}`, {}, token, ucrmKey);
};

const activateTeamMember = (id: string) => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;
  return ApiCalls.patchResponse(`ucrms/activate/${id}`, {}, token, ucrmKey);
};

const TeamApis = {
  getAllTeamMembers,
  updateTeamMember,
  deactivateTeamMember,
  activateTeamMember,
};

export default TeamApis;
