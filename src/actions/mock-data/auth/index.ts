import userMockData from "./user.json";

export const getMockMyProfile = () => {
  return new Promise((resolve) => {
    return resolve(userMockData);
  });
};
