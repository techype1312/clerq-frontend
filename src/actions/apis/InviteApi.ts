import * as ApiCalls from "../ApiCalls";
import { getCookie } from "../cookieUtils";

const getAllInvites = (query: {
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
    `invites?page=${page}&limit=${limit}&filters=${JSON.stringify(
      filters
    )}&sort=${JSON.stringify(sort)}`,
    null,
    token,
    ucrmKey
  );
};

const createInvite = (payload: any) => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;
  return ApiCalls.postResponse(`invites`, payload, token, ucrmKey);
};

const updateInviteRole = (id: string, payload: any) => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;
  return ApiCalls.patchResponse(`invites/${id}`, payload, token, ucrmKey);
};

const removeInvite = (id: string) => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;
  return ApiCalls.deleteResponse(`invites/${id}`, null, token, ucrmKey);
};

const resendInviteLink = (id: string) => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;
  return ApiCalls.postResponse(
    `invites/${id}/invite-link`,
    {},
    token,
    ucrmKey
  );
};

const acceptInvite = (id: string, payload: any) => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;
  return ApiCalls.postResponse(`invites/${id}/accept`, payload, token, ucrmKey);
};

const InviteTeamApis = {
  getAllInvites,
  createInvite,
  removeInvite,
  resendInviteLink,
  acceptInvite,
  updateInviteRole
};

export default InviteTeamApis;
