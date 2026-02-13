import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/blogs(.*)",
  "/posts(.*)",
  "/projects(.*)",
  "/contact",
  "/api/posts(.*)",
  "/api/projects(.*)",
  "/api/search",
  "/api/stats",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  response.headers.set("X-DNS-Prefetch-Control", "on");

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://giscus.app https://vercel.live https://*.clerk.accounts.dev https://challenges.cloudflare.com;
    style-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev;
    img-src 'self' blob: data: https: http: https://*.clerk.accounts.dev https://img.clerk.com;
    font-src 'self' data:;
    connect-src 'self' https://giscus.app https://vercel.live https://vitals.vercel-insights.com https://*.clerk.accounts.dev https://clerk.accounts.dev https://api.clerk.dev;
    frame-src 'self' https://giscus.app https://*.clerk.accounts.dev https://challenges.cloudflare.com;
    media-src 'self';
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
