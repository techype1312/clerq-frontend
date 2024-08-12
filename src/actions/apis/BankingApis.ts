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

const getBankTransactions = (companyId: string) => {
    const token = getCookie("token") || null;
    return ApiCalls.getResponse(`banking/transactions/${companyId}`, null, token);
}

const BankingApis = {
    generateLinkToken,
    exchangePublicToken,
    getBankTransactions,
    getBankAccounts
};
export default BankingApis;
