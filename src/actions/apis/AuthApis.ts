import * as ApiCalls from "../ApiCalls";
import { getCookie } from "../cookieUtils";

const getCheck = (payload: any) => {
  const jwtToken = getCookie("jwtToken") || null;
  return ApiCalls.getResponse(`users/`, payload, jwtToken);
};

const login = (searchParams: string, payload: any) => {
  return ApiCalls.postResponse(
    `auth/email/login?${searchParams}`,
    payload,
    null
  );
};
const loginWithOtp = (payload: any) => {
  return ApiCalls.postResponse(`auth/phone/login`, payload, null);
};

const verifyOtp = (payload: any) => {
  return ApiCalls.patchResponse(`v1/users/verify-otp`, payload, null);
};

// const signIn = (payload: any) => {
//     return ApiCalls.postResponse(`auth/local`, payload, null);
// }
const signUp = (payload: any) => {
  return ApiCalls.postResponse(`auth/email/register`, payload, null);
};

const signOut = () => {
  return ApiCalls.getResponse(
    `v1/users/logout/`,
    {},
    getCookie("jwtToken") || ""
  );
};

const profile = () => {
  const a = ApiCalls.getResponse(`auth/me`, {}, getCookie("jwtToken") || "");
  return a;
};

const deleteAccount = (payload: string) => {
  return ApiCalls.deleteResponse(
    `v1/users/${payload}`,
    null,
    getCookie("jwtToken") || ""
  );
};

const verifyRefreshToken = () => {
  return ApiCalls.postResponse(
    `v1/users/verify-refresh-token`,
    {},
    getCookie("refreshToken") || ""
  );
};

type InviteTeamMemberPayload = {
  email: string;
  role: string;
  domain: string;
};

const inviteTeamMember = (payload: InviteTeamMemberPayload) => {
  return ApiCalls.postResponse(
    `v1/users/invite-team-member`,
    payload,
    getCookie("jwtToken") || ""
  );
};

const acceptInvite = (id: string) => {
  return ApiCalls.postResponse(`v1/users/invite-team-member/${id}`, null, null);
};

const healthCheck = () => {
  return ApiCalls.getResponse(``, {}, null);
};
const confirmEmail = (payload: any) => {
  return ApiCalls.postResponse(`auth/email/confirm`, payload, null);
};

const verifyMagicLinkHash = (hash: string) => {
  return ApiCalls.getResponse(`auth/email/verify/magic-link`, hash, null);
};

const updateUser = (payload: any) => {
  return ApiCalls.patchResponse(`auth/me`, payload, getCookie("jwtToken") || "");
}

const AuthApis = {
  getCheck,
  login,
  loginWithOtp,
  verifyOtp,
  signUp,
  signOut,
  profile,
  deleteAccount,
  verifyRefreshToken,
  inviteTeamMember,
  acceptInvite,
  healthCheck,
  confirmEmail,
  verifyMagicLinkHash,
  updateUser
};

export default AuthApis;
