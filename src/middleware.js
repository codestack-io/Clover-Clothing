
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = Boolean(token);
  const isAdmin = token?.role === "admin";
  const reqPath = req.nextUrl.pathname;

  // Protect all Admin Dashboard routes
  if (reqPath.startsWith("/dashboard")) {
    if (!isAuthenticated || !isAdmin) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};