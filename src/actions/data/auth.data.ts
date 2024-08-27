import { get, patch, post } from "@/utils/fetch.util";

const signUpUser = (payload: any) =>
  post({
    url: `/v1/auth/email/register`,
    data: payload,
  }).then((resp) => payload);

const loginUserWithEmail = (searchParams: string, payload: any) =>
  post({
    url: `/v1/auth/email/login?${searchParams}`,
    data: payload,
  }).then((resp) => payload);

const loginUserWithOtp = (payload: any) =>
  post({
    url: `/v1/auth/phone/login`,
    data: payload,
  }).then((resp) => payload);

const verifyOtp = (payload: any) =>
  post({
    url: `/v1/auth/phone/verify/otp`,
    data: payload,
  }).then((resp) => resp);

const signOutUser = () =>
  post({
    url: `/v1/auth/logout`,
  }).then((resp) => resp);

const verifyRefreshToken = (payload: any) =>
  post({
    url: `/v1/auth/refresh`,
    data: payload,
  }).then((resp) => resp);

const healthCheck = () =>
  get({
    url: `/v1/health`,
  }).then((resp) => resp);

const confirmUserEmail = (hash: string) =>
  post({
    url: `/v1/auth/email/confirm`,
    data: { hash },
  }).then((resp) => resp);

const verifyMagicLinkHash = (hash: string) =>
  post({
    url: `/v1/auth/email/verify/magic-link`,
    data: { hash },
  }).then((resp) => resp);

const getMyprofile = () =>
  get({
    url: `/v1/auth/me`,
  }).then((resp) => resp);

const updateMyProfile = (payload: any) =>
  patch({
    url: `/v1/auth/me`,
    data: payload,
  }).then((resp) => resp);

const AuthApis = {
  signUpUser,
  loginUserWithEmail,
  signOutUser,
  loginUserWithOtp,
  verifyOtp,
  verifyRefreshToken,
  healthCheck,
  confirmUserEmail,
  verifyMagicLinkHash,
  getMyprofile,
  updateMyProfile,
};

export default AuthApis;
