import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16 "proxy" convention (replaces the deprecated middleware file).

export function proxy(request: NextRequest) {
  let userId = request.cookies.get("e90_user_id")?.value;
  let response: NextResponse;

  if (!userId) {
    userId = "u_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("cookie", `${request.headers.get("cookie") || ""}; e90_user_id=${userId}`);
    response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    response.cookies.set("e90_user_id", userId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year persistence
      sameSite: "lax",
      httpOnly: false,
    });
  } else {
    response = NextResponse.next();
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
