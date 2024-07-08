import Cookies from "js-cookie";

 export function getCookie(name: string) {
  //We can perform additional operations on cookies here if needed
  return Cookies.get(name);
 }
