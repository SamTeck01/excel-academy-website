import { NextResponse, type NextRequest } from "next/server";

const ROOT = "excelacademyonline.com";
const SITE = `https://${ROOT}`;
const DASH = `https://dashboard.${ROOT}`;
const APP_PATHS = /^\/(dashboard|learn|login|signup)(\/|$)/;

/** Keeps students on the dashboard address and visitors on the website. Other hosts serve everything. */
export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") || "").split(":")[0];
  const { pathname, search } = req.nextUrl;

  if (host === `dashboard.${ROOT}`) {
    if (pathname === "/") return NextResponse.redirect(new URL("/dashboard", DASH));
    const course = pathname.match(/^\/course\/([^/]+)/);
    if (course) return NextResponse.redirect(new URL(`/dashboard/explore/${course[1]}`, DASH));
    if (pathname.startsWith("/courses")) return NextResponse.redirect(new URL("/dashboard/explore", DASH));
    if (!APP_PATHS.test(pathname) && !pathname.startsWith("/payment")) return NextResponse.redirect(SITE + pathname + search);
  } else if ((host === ROOT || host === `www.${ROOT}`) && APP_PATHS.test(pathname)) {
    return NextResponse.redirect(DASH + pathname + search);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next|api|mock|.*\\..*).*)"] };
