import documentsMockData from "./documents.json";

export const getMockAllDocuments = (companyId: string, type: string) => {
  return new Promise((resolve) => {
    const documentsMock = documentsMockData.filter(
      (md) => md.company === companyId && md.type === type
    );
    return resolve({ data: documentsMock, hasNextPage: false });
  });
};
