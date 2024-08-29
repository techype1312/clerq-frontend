import {
  getMockBalanceSheet,
  getMockIncomeStatement,
  getMockAnalytics
} from "../mock-data/finance";

const getIncomeStatement = async (year: string) => {
  return getMockIncomeStatement(year);
};

const getBalanceSheet = async (year: string) => {
  return getMockBalanceSheet(year);
};

const getAnalytics = async (duration: string) => {
  return getMockAnalytics(duration);
}

const FinanceApis = {
  getIncomeStatement,
  getBalanceSheet,
  getAnalytics
};

export default FinanceApis;
