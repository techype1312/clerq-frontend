import {
  getMockBalanceSheet,
  getMockIncomeStatement,
} from "../mock-data/finance";

const getIncomeStatement = async (year: string) => {
  return getMockIncomeStatement(year);
};

const getBalanceSheet = async (year: string) => {
  return getMockBalanceSheet(year);
};

const FinanceApis = {
  getIncomeStatement,
  getBalanceSheet,
};

export default FinanceApis;
