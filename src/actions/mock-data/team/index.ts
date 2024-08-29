import memebersMockData from "./members.json";

export const getMockAllTeamMembers = (companyId: string) => {
  return new Promise((resolve) => {
    const membersMock = memebersMockData.filter(
      (md) => md.company.id === companyId
    );
    return resolve({ data: membersMock, hasNextPage: false });
  });
};
