import { NextRequest, NextResponse } from "next/server";
import {
  authOnboardingBucket,
  authorizationTokenBucket,
} from "./utils/session-manager.util";
import { isDemoEnv } from "../config";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(authorizationTokenBucket)?.value;
  const isUserOnboarded =
    request.cookies.get(authOnboardingBucket)?.value ?? "false";

  if (
    token &&
    isUserOnboarded === "false" &&
    pathname !== "/dashboard/verify-user"
  ) {
    return NextResponse.redirect(
      new URL("/dashboard/verify-user", request.url)
    );
  } else if (
    token &&
    isUserOnboarded === "true" &&
    pathname === "/dashboard/verify-user"
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (
    pathname.startsWith("/onboarding") &&
    pathname.includes("/new-company") &&
    !token
  ) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  } else if (pathname.startsWith("/onboarding") && token && isDemoEnv()) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if ((pathname.startsWith("/dashboard") || pathname === "/") && !token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  } else if ((pathname.startsWith("/auth") || pathname === "/") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

// export const config = {
//   matcher: ["/", "/dashboard/:path*", "/signin", "/signup"],
// };
export const config = {
  matcher: [
    // "/",
    "/auth/:path*",
    "/dashboard/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
