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

const BankingApis = {
    generateLinkToken,
    exchangePublicToken
};
export default BankingApis;
