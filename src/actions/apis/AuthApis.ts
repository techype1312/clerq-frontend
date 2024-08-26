import * as ApiCalls from "../ApiCalls";
import { getCookie } from "../cookieUtils";

const getCheck = (payload: any) => {
  const token = getCookie("token") || null;
  return ApiCalls.getResponse(`users/`, payload, token);
};

const login = (searchParams: string, email: string | null) => {
  return ApiCalls.postResponse(
    `auth/email/login?${searchParams}`,
    {email},
    null
  );
};
const loginWithOtp = (payload: any) => {
  return ApiCalls.postResponse(`auth/phone/login`, payload, null);
};

const verifyOtp = (payload: any) => {
  return ApiCalls.postResponse(`auth/phone/verify/otp`, payload, null);
};

// const signIn = (payload: any) => {
//     return ApiCalls.postResponse(`auth/local`, payload, null);
// }
const signUp = (payload: any) => {
  return ApiCalls.postResponse(`auth/email/register`, payload, null);
};

const signOut = () => {
  return ApiCalls.postResponse(`auth/logout/`, {}, getCookie("token") || "");
};

const profile = () => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;
  return ApiCalls.getResponse(`auth/me`, {}, token, ucrmKey);
};

const deleteAccount = (payload: string) => {
  return ApiCalls.deleteResponse(
    `v1/users/${payload}`,
    null,
    getCookie("token") || ""
  );
};

const verifyRefreshToken = () => {
  return ApiCalls.postResponse(
    `auth/refresh`,
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
    getCookie("token") || ""
  );
};

const acceptInvite = (id: string) => {
  return ApiCalls.postResponse(`v1/users/invite-team-member/${id}`, null, null);
};

const healthCheck = () => {
  return ApiCalls.getResponse(``, {}, null);
};
const confirmEmail = (hash: string) => {
  return ApiCalls.postResponse(`auth/email/confirm`, { hash: hash }, null);
};

const verifyMagicLinkHash = (hash: string) => {
  return ApiCalls.postResponse(
    `auth/email/verify/magic-link`,
    { hash: hash },
    null
  );
};

const updateUser = (payload: any) => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;
  return ApiCalls.patchResponse(`auth/me`, payload, token, ucrmKey);
};

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
  updateUser,
};

export default AuthApis;
