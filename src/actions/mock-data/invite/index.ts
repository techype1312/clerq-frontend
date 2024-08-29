import invitesMockData from "./invites.json";

export const getMockAllInvites = (companyId: string) => {
  return new Promise((resolve) => {
    const invitesMock = invitesMockData.filter(
      (md) => md.company.id === companyId
    );
    return resolve({ data: invitesMock, hasNextPage: false });
  });
};
