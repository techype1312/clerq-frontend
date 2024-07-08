import * as ApiCalls from '../ApiCalls';
import { getCookie } from "../cookieUtils";

const getCheck = (payload: any) => {
    const jwtToken = getCookie("jwtToken") || null;
    return ApiCalls.getResponse(`users/`, payload, jwtToken);
};

const login = (payload: any) => {
    return ApiCalls.postResponse(`auth/local`, payload, null);
}

const verifyOtp = (payload: any) => {
    return ApiCalls.patchResponse(`v1/users/verify-otp`, payload, null);
}

const signIn = (payload: any) => {
    return ApiCalls.postResponse(`auth/local`, payload, null);
}
const signUp = (payload: any) => {
    return ApiCalls.postResponse(`auth/local/register`, payload, null);
}

const signOut = () => {
    return ApiCalls.getResponse(`v1/users/logout/`, {}, getCookie("jwtToken") || '');
}

const profile = () => {
    const a = ApiCalls.getResponse(`v1/users/profile`, {}, getCookie("jwtToken") || '');
    return a;
}

const deleteAccount = (payload: string) => {
    return ApiCalls.deleteResponse(`v1/users/${payload}`, null, getCookie("jwtToken") || '');
}

const verifyRefreshToken = () => {
    return ApiCalls.postResponse(`v1/users/verify-refresh-token`, {refToken: getCookie("refreshToken")}, null);
}

type InviteTeamMemberPayload = {
    email: string,
    role: string,
    domain: string
}

const inviteTeamMember = (payload: InviteTeamMemberPayload) => {
    return ApiCalls.postResponse(`v1/users/invite-team-member`, payload, getCookie("jwtToken") || '');
}

const acceptInvite = (id: string) => {
    return ApiCalls.postResponse(`v1/users/invite-team-member/${id}`, null, null);
}

const AuthApis = {
    getCheck,
    login,
    verifyOtp,
    signIn,
    signUp,
    signOut,
    profile,
    deleteAccount,
    verifyRefreshToken,
    inviteTeamMember,
    acceptInvite,
};

export default AuthApis;