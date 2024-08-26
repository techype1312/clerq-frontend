import { get, patch } from "@/utils/fetch.util";

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
  const sort = [{ orderBy, order }];
  return get({
    url: `/v1/ucrms?page=${page}&limit=${limit}&filters=${JSON.stringify(
      filters
    )}&sort=${JSON.stringify(sort)}`,
  }).then((resp) => resp);
};

const updateTeamMember = async (id: string, payload: any) => {
  return patch({
    url: `/v1/ucrms/${id}`,
    data: payload,
  }).then((resp) => resp);
};

const deactivateTeamMember = async (id: string) => {
  return patch({
    url: `/v1/ucrms/deactivate/${id}`,
  }).then((resp) => resp);
};

const activateTeamMember = async (id: string) => {
  return patch({ url: `/v1/ucrms/activate/${id}` }).then((resp) => resp);
};

const TeamApis = {
  getAllTeamMembers,
  updateTeamMember,
  deactivateTeamMember,
  activateTeamMember,
};

export default TeamApis;
