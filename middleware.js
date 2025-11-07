import { NextResponse } from "next/server";

export function middleware(req) {
  const inviteCookie = req.cookies.get("ghostify_invite_ok");
  const url = req.nextUrl.clone();

  if (!inviteCookie && !url.pathname.startsWith("/invite")) {
    url.pathname = "/invite";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
