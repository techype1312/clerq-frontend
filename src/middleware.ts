import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const jwtToken = request.cookies.get("jwtToken")?.value;
  console.log(jwtToken, pathname, "middleware");
  if (pathname.startsWith("/dashboard") && !jwtToken && pathname != "/") {
    return NextResponse.redirect(new URL("/", request.url));
  } else if ((pathname === "/signup" || pathname === "/signin") && jwtToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/signin", "/signup"],
};
