import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // Rate limit auth endpoints
    if (pathname.startsWith("/api/auth") && req.method === "POST") {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      const { allowed, resetIn } = checkRateLimit(`auth:${ip}`, 10, 60000);
      if (!allowed) {
        return NextResponse.json(
          { error: "Demasiados intentos. Intente de nuevo más tarde." },
          { status: 429, headers: { "Retry-After": String(Math.ceil(resetIn / 1000)) } }
        );
      }
    }

    const token = req.nextauth.token;
    const isAdmin = token?.role === "admin";
    const isAdminRoute = pathname.startsWith("/admin");

    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL("/login?error=unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/admin")) return !!token;
        if (req.nextUrl.pathname.startsWith("/account")) return !!token;
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/api/auth/:path*"],
};
