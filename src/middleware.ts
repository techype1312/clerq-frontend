import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const isUserOnboard =
    request.cookies.get("onboarding_completed")?.value ?? "false";
  if (
    token &&
    isUserOnboard === "false" &&
    pathname !== "/dashboard/verify-user"
  ) {
    return NextResponse.redirect(
      new URL("/dashboard/verify-user", request.url)
    );
  } else if (
    token &&
    isUserOnboard === "true" &&
    pathname === "/dashboard/verify-user"
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (pathname.startsWith("/dashboard") && !token && pathname != "/") {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  } else if (pathname.startsWith("/auth") && token) {
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
