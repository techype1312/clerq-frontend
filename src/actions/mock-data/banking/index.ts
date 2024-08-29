import transactionsMockData from "./transactions.json";
import accountsMockData from "./accounts.json";

export const getMockBankTransactions = (companyId: string) => {
  return new Promise((resolve) => {
    const accounts = accountsMockData.filter((md) => md.company === companyId);
    const accountIds = accounts.map((acc) => acc.id);
    const transactionsMock = transactionsMockData.filter((md) =>
      accountIds.includes(md.account.id)
    );
    return resolve({ data: transactionsMock, hasNextPage: false });
  });
};

export const getMockbankAccounts = (companyId: string) => {
  return new Promise((resolve) => {
    const accountsMock = accountsMockData.filter(
      (md) => md.company === companyId
    );
    return resolve(accountsMock);
  });
};
