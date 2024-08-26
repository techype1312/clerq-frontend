import Cookies from "js-cookie";

export function getCookie(name: string) {
  return Cookies.get(name);
}

export function setCookie(
  name: string,
  value: any,
  options?: Cookies.CookieAttributes
) {
  return Cookies.set(name, value, { ...options, path: "/" });
}

export const removeCookie = (name: string) => {
  Cookies.remove(name, { path: "/" });
  Cookies.remove(name);
};

export const removeAllCookies = (names: string[]) => {
  names.forEach((name) => {
    Cookies.remove(name, { path: "/" });
    Cookies.remove(name);
  });
};
