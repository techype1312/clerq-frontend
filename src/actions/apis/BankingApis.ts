import * as ApiCalls from "../ApiCalls";
import { getCookie } from "../cookieUtils";

const generateLinkToken = (payload: string) => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;
  return ApiCalls.postResponse(`banking/link-token`, payload, token, ucrmKey);
};

const exchangePublicToken = (payload: string) => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;
  return ApiCalls.postResponse(`banking/institutions`, payload, token, ucrmKey);
};

const getBankAccounts = (companyId: string) => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;
  return ApiCalls.getResponse(`banking/accounts/${companyId}`, null, token, ucrmKey);
};

const getBankTransactions = (companyId: string, searchParams: any) => {
  const token = getCookie("token") || "";
  const ucrmKey = getCookie("otto_ucrm") || null;
  return ApiCalls.getResponseWithQueryParams(`banking/transactions/${companyId}`, searchParams, token, ucrmKey);
};


const BankingApis = {
  generateLinkToken,
  exchangePublicToken,
  getBankTransactions,
  getBankAccounts,
};
export default BankingApis;
