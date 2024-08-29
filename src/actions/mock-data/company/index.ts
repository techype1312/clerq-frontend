import companiesMockData from "./companies.json";
import ucrmsMockData from "./ucrms.json";

export const getMockCompany = (companyId: string) => {
  return new Promise((resolve) => {
    const companyMock =
      companiesMockData.find((md) => md.id === companyId) || {};
    return resolve(companyMock);
  });
};

export const getMockMyAllUCRMs = () => {
  return new Promise((resolve) => {
    return resolve({
      data: ucrmsMockData,
      hasNextPage: false,
    });
  });
};

export const getMockUCRM = (ucrmId: string) => {
  return new Promise((resolve) => {
    const ucrmMock = ucrmsMockData.find((md) => md.id === ucrmId) || {};
    var delayInMilliseconds = 2000;
    setTimeout(function() {
      return resolve(ucrmMock);
    }, delayInMilliseconds);
  });
};
