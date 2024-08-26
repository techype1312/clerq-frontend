import { get, post, patch, remove } from "@/utils/fetch.util";

interface IAcceptInvitePayload {
  hash: string;
  password: string;
  phone: string;
  country_code: number;
  firstName: string;
  lastName: string;
}

interface IConfirmInvitePayload {
  hash: string;
}

interface IVerifyInvitePayload {
  hash: string;
}

const getAllInvites = async (query: {
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
    url: `/v1/invites?page=${page}&limit=${limit}&filters=${JSON.stringify(
      filters
    )}&sort=${JSON.stringify(sort)}`,
  }).then((resp) => resp);
};

const createInvite = async (payload: any) => {
  return post({
    url: `/v1/invites`,
    data: payload,
  }).then((resp) => resp);
};

const updateInviteRole = async (id: string, payload: any) => {
  return patch({
    url: `/v1/invites/${id}`,
    data: payload,
  }).then((resp) => resp);
};

const removeInvite = async (id: string) => {
  return remove({
    url: `/v1/invites/${id}`,
  }).then((resp) => resp);
};

const resendInviteLink = async (id: string) => {
  return post({
    url: `/v1/invites/${id}/invite-link`,
  }).then((resp) => resp);
};

const acceptInvite = async (
  payload: IConfirmInvitePayload | IAcceptInvitePayload
) => {
  return post({
    url: `/v1/invites/accept`,
    data: payload,
  }).then((resp) => resp);
};

const verifyInvite = async (payload: IVerifyInvitePayload) => {
  return post({
    url: `/v1/invites/verify`,
    data: payload,
  }).then((resp) => resp);
};

const InviteTeamApis = {
  getAllInvites,
  createInvite,
  removeInvite,
  resendInviteLink,
  acceptInvite,
  updateInviteRole,
  verifyInvite,
};

export default InviteTeamApis;
