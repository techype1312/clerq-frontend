import type { AuthTokens } from '@/types/general';

import { getCookie, removeCookie, setCookie } from './storage/cookies.util';
import { IUcrm } from '@/types/ucrm';

export const authorizationTokenBucket = 'otto-jwt-token';
export const authRefreshTokenBucket = 'otto-jwt-refresh_token';
export const authOnboardingBucket = 'otto-onboarding_completed';
export const authUcrmDataBucket = 'otto-auth-ucrm';
export const sessionIdBucket = 'otto-session-id';

export function getAuthOnboardingStatus() {
  return getCookie(authOnboardingBucket);
}

export function removeAuthOnboardingStatus() {
  return removeCookie(authOnboardingBucket);
}

export function setAuthOnboardingStatus(onboarding_completed: boolean) {
  return setCookie(authOnboardingBucket, String(onboarding_completed));
}

export function getAuthToken() {
  return getCookie(authorizationTokenBucket);
}

export function removeAuthToken() {
  return removeCookie(authorizationTokenBucket);
}

export function setAuthToken(token: string, expires?: number ) {
  return setCookie(authorizationTokenBucket, token, { expires });
}

export function getAuthRefreshToken() {
  return getCookie(authRefreshTokenBucket);
}

export function removeAuthRefreshToken() {
  return removeCookie(authRefreshTokenBucket);
}

export function setAuthRefreshToken(token: string) {
  return setCookie(authRefreshTokenBucket, token);
}

export function setAuthUcrmId(ucrm: IUcrm['id']) {
  return setCookie(authUcrmDataBucket, ucrm);
}

export function getAuthUcrmId() {
  return getCookie(authUcrmDataBucket);
}

export function removeAuthUcrmId() {
  return removeCookie(authUcrmDataBucket);
}

export function getSessionId() {
  return getCookie(sessionIdBucket);
}

export function removeSessionId() {
  return removeCookie(sessionIdBucket);
}

export function setSessionId(id: string | number) {
  if (getSessionId() === id) return;
  setCookie(sessionIdBucket, id);
}

if (!getSessionId()) setSessionId(Date.now());
