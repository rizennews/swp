import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Allow access to the login page
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  try {
    const response = await fetch(new URL("/api/auth/get-session", request.url), {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });
    
    if (!response.ok) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    const sessionData = await response.json();

    if (!sessionData || !sessionData.session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware session check failed:", error);
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
