import * as ApiCalls from "../ApiCalls";
import { getCookie } from "../cookieUtils";

const generateLinkToken = (payload: string) => {
    const token = getCookie("token") || null;
    return ApiCalls.postResponse(`banking/link-token`, payload, token);
}

const exchangePublicToken = (payload: string) => {
    const token = getCookie("token") || null;
    return ApiCalls.postResponse(`banking/institutions`, payload, token);
}

const getBankAccounts = (companyId: string) => {
    const token = getCookie("token") || null;
    return ApiCalls.getResponse(`banking/accounts/${companyId}`, null, token);
}

const getBankTransactions = (companyId: string, searchParams: any) => {
    const token = getCookie("token") || "";
    return ApiCalls.getResponseWithQueryParams(`banking/transactions/${companyId}`, searchParams, token);
}


const BankingApis = {
    generateLinkToken,
    exchangePublicToken,
    getBankTransactions,
    getBankAccounts
};
export default BankingApis;
