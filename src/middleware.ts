import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // "/",
    "/signin",
    "/dashboard/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

// import { NextRequest, NextResponse } from "next/server";

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const jwtToken = request.cookies.get("jwtToken")?.value;
//   const isUserOnboard = request.cookies.get("isUserOnboard")?.value;
//   if (
//     jwtToken &&
//     isUserOnboard === "false" &&
//     pathname !== "/dashboard/verify-user"
//     // !pathname.startsWith("/dashboard/verify-")
//   ) {
//     return NextResponse.redirect(
//       new URL("/dashboard/verify-user", request.url)
//     );
//   } else if (
//     jwtToken &&
//     isUserOnboard === "true" &&
//     pathname === "/dashboard/verify-user"
//   ) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }
//   if (pathname.startsWith("/dashboard") && !jwtToken && pathname != "/") {
//     return NextResponse.redirect(new URL("/", request.url));
//   } else if ((pathname === "/signup" || pathname === "/signin") && jwtToken) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/", "/dashboard/:path*", "/signin", "/signup"],
// };
