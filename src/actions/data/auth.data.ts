import { get, patch, post } from "@/utils/fetch.util";
import { isDemoEnv } from "../../../config";
import { getMockMyProfile } from "../mock-data/auth";

const signUpUser = async (payload: any) => {
  return post({
    url: `/v1/auth/email/register`,
    data: payload,
  }).then((resp) => payload);
};

const loginUserWithEmail = async (searchParams: string, payload: any) => {
  return post({
    url: `/v1/auth/email/login?${searchParams}`,
    data: payload,
  }).then((resp) => payload);
};

const loginUserWithOtp = async (payload: any) => {
  return post({
    url: `/v1/auth/phone/login`,
    data: payload,
  }).then((resp) => payload);
};

const verifyOtp = async (payload: any) => {
  return post({
    url: `/v1/auth/phone/verify/otp`,
    data: payload,
  }).then((resp) => resp);
};

const signOutUser = async () => {
  return post({
    url: `/v1/auth/logout`,
  }).then((resp) => resp);
};

const verifyRefreshToken = async (payload: any) => {
  return post({
    url: `/v1/auth/refresh`,
    data: payload,
  }).then((resp) => resp);
};

const healthCheck = async () => {
  return get({
    url: `/v1/health`,
  }).then((resp) => resp);
};

const confirmUserEmail = async (hash: string) => {
  return post({
    url: `/v1/auth/email/confirm`,
    data: { hash },
  }).then((resp) => resp);
};

const verifyMagicLinkHash = async (hash: string) => {
  return post({
    url: `/v1/auth/email/verify/magic-link`,
    data: { hash },
  }).then((resp) => resp);
};

const getMyprofile = async () => {
  if (isDemoEnv()) {
    return getMockMyProfile();
  }
  return get({
    url: `/v1/auth/me`,
  }).then((resp) => resp);
};

const updateMyProfile = async (payload: any) => {
  return patch({
    url: `/v1/auth/me`,
    data: payload,
  }).then((resp) => resp);
};

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
