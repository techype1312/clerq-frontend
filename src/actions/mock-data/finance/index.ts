import statements from "./income-statement.json";
import balanceSheets from "./balance-sheet.json";
import analytics from "./analytics.json";

export const getMockIncomeStatement = (year: string) => {
  return new Promise((resolve) => {
    const statementMock = statements.find((md) => md.year === year);
    return resolve(statementMock);
  });
};

export const getMockBalanceSheet = (year: string) => {
  return new Promise((resolve) => {
    const sheet = balanceSheets.find((md) => md.year === year);
    return resolve(sheet);
  });
};

export const getMockAnalytics  = (duration: string) => {
  return new Promise((resolve) => {
    const analyticsData = analytics.find((md) => md.duration === duration);
    return resolve(analyticsData);
  });
}