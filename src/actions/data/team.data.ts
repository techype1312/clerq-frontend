import { get, patch } from "@/utils/fetch.util";
import { isDemoEnv } from "../../../config";
import { getMockAllTeamMembers } from "../mock-data/team";
import { getMockUCRM } from "../mock-data/company";
import { getAuthUcrmId } from "@/utils/session-manager.util";

const getAllTeamMembers = async (query: {
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

  if (isDemoEnv()) {
    const ucrmId = getAuthUcrmId();
    const ucrm: any = await getMockUCRM(ucrmId as string);
    const companyId = ucrm?.company?.id;
    return getMockAllTeamMembers(companyId);
  }

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
