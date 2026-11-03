import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { MONTHS } from "./utils/get-month-days";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/no-access") {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token.role) {
    return NextResponse.redirect(new URL("/no-access", request.url));
  }

  // if (token.role === "staff" && pathname !== "/schedule") {
  //   const currentDate = new Date();
  //   const month = MONTHS[currentDate.getMonth()];
  //   return NextResponse.redirect(
  //     new URL(`/schedule?month=${month}`, request.url),
  //   );
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!$|api|_next/static|_next/image|favicon\\.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.webp$|.*\\.ico$).*)",
  ],
};
