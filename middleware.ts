import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Security headers configuration
 */
const securityHeaders = {
  // Prevent clickjacking attacks
  "X-Frame-Options": "SAMEORIGIN",

  // Prevent MIME type sniffing
  "X-Content-Type-Options": "nosniff",

  // Enable XSS protection (legacy browsers)
  "X-XSS-Protection": "1; mode=block",

  // Control referrer information
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // Permissions Policy (formerly Feature Policy)
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",

  // DNS prefetching
  "X-DNS-Prefetch-Control": "on",

  // Force HTTPS
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
};

/**
 * Content Security Policy configuration
 * Adjust based on your specific needs
 */
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-analytics.com *.google-analytics.com *.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self' data:;
  connect-src 'self' *.vercel-analytics.com *.google-analytics.com vitals.vercel-insights.com;
  media-src 'self';
  object-src 'none';
  frame-src 'self';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add CSP header
  response.headers.set("Content-Security-Policy", cspHeader);

  // Add cache control for static assets
  if (request.nextUrl.pathname.startsWith("/frames/")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable",
    );
  }

  // Add cache control for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300",
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
