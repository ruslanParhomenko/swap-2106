import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ROLE_ADMIN } from "./constants/role";
import { ARCHIVE_ROUTE, SWAP_ROUTE } from "./constants/nav-items";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    if (pathname === "/") return NextResponse.next();

    const url = new URL("/", request.url);
    url.searchParams.set("callbackUrl", `${pathname}${search}`);

    return NextResponse.redirect(url);
  }

  if (!token.role) {
    return NextResponse.redirect(new URL("/no-access", request.url));
  }

  if (String(token.role).toLowerCase() === ROLE_ADMIN && pathname === "/") {
    return NextResponse.redirect(new URL(ARCHIVE_ROUTE, request.url));
  }

  if (pathname === "/") {
    const url = new URL(SWAP_ROUTE, request.url);

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/|revalidate/|_next/static|_next/image|favicon\\.ico|no-access(?:/|$)|.*\\.(?:svg|png|jpg|webp|ico)$).*)",
  ],
};
