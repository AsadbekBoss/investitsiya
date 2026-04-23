import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routelar — hamma kira oladi
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Static fayllar va API — o'tkazib yuborish
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Bosh sahifaga kelsa login ga redirect
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
