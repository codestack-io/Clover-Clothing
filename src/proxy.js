// src/proxy.js
import { getToken } from "next-auth/jwt"; // correct; 
import { NextResponse } from "next/server";

const privateRoute = ["/dashboard", "/Cart", "/CheckOutFrom"];

export async function proxy(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const isAuthenticated = Boolean(token);

    const reqPath = req.nextUrl.pathname;
    const isPrivateReq = privateRoute.some(route => reqPath.startsWith(route));

    if (isPrivateReq && !isAuthenticated) {
      // redirect to login if not authenticated
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Proxy Middleware Error:", error);
    return NextResponse.next();
  }
}

// Apply middleware to specific paths
export const config = {
  matcher: ["/dashboard/:path*", "/Cart/:path*", "/CheckOutFrom/:path*"],
};