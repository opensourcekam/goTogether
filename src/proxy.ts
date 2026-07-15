import { NextResponse, type NextRequest } from "next/server";

import { isNeonAuthConfigured } from "@/lib/auth/config";
import { auth } from "@/lib/auth/server";

const neonAuthProxy = auth.middleware({
  loginUrl: "/auth/sign-in",
});

/**
 * Server Actions (POST carrying `Next-Action`) and RSC data fetches (`RSC: 1`)
 * must receive a Flight/action stream, never a raw 307 redirect to an HTML page.
 * When the proxy redirects these, the client throws "An unexpected response was
 * received from the server" — which is exactly what happens on the sign-in ->
 * discover -> onboarding redirect chain. We let those requests through and rely
 * on page/action-level auth guards (`requireAppUser` / the actions' own checks),
 * which emit proper RSC redirects/results. Full document navigations (including
 * OAuth callbacks that carry the verifier query param) still go through the Neon
 * Auth middleware so unauthenticated users get an instant redirect.
 */
function isRscOrActionRequest(request: NextRequest): boolean {
  return (
    request.headers.get("next-action") !== null ||
    request.headers.get("rsc") !== null
  );
}

/**
 * Next.js 16 proxy (formerly middleware). Protects app routes when Neon Auth
 * is configured; otherwise sends users to sign-in with setup guidance.
 */
export default async function proxy(request: NextRequest) {
  if (isRscOrActionRequest(request)) {
    return NextResponse.next();
  }

  if (!isNeonAuthConfigured()) {
    const signIn = new URL("/auth/sign-in", request.url);
    return NextResponse.redirect(signIn);
  }

  return neonAuthProxy(request);
}

export const config = {
  matcher: ["/onboarding/:path*", "/discover/:path*", "/trips/:path*"],
};
