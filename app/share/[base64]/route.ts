import { NextRequest, NextResponse } from "next/server";

/**
 *
 * @param request
 * @param root0
 * @param root0.params
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ base64: string }> },
) {
  try {
    const resolvedParams = await params;

    // Validate base64 input
    if (!resolvedParams.base64) {
      return NextResponse.redirect(
        new URL(
          `/share/error?message=${encodeURIComponent("No base64 data provided")}`,
          request.url,
        ),
      );
    }

    // Restore base64 padding and reverse URL-safe characters
    let base64String = resolvedParams.base64
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    // Add padding if needed
    while (base64String.length % 4) {
      base64String += "=";
    }

    // Decode the base64 URL
    let decodedString: string;
    try {
      decodedString = Buffer.from(base64String, "base64").toString();
    } catch (error) {
      return NextResponse.redirect(
        new URL(
          `/share/error?message=${encodeURIComponent(
            `Failed to decode base64 string: ${error instanceof Error ? error.message : "Unknown error"}`,
          )}`,
          request.url,
        ),
      );
    }

    try {
      // Try parsing as a full URL first
      const url = new URL(decodedString, request.nextUrl.origin);

      // Security check: Ensure URL is from the same origin
      if (url.origin !== request.nextUrl.origin && url.origin !== "") {
        return NextResponse.redirect(
          new URL(
            `/share/error?message=${encodeURIComponent(
              `Invalid URL origin. Expected: ${request.nextUrl.origin}, Got: ${url.origin}`,
            )}`,
            request.url,
          ),
        );
      }

      // Extract the path and search params
      const path = url.pathname;
      const searchParams = url.search;

      // Validate path starts with /caption/
      if (!path.startsWith("/caption/")) {
        return NextResponse.redirect(
          new URL(
            `/share/error?message=${encodeURIComponent(
              `Invalid path. Must start with /caption/. Got: ${path}`,
            )}`,
            request.url,
          ),
        );
      }

      // Redirect to the decoded URL
      return NextResponse.redirect(
        new URL(`${path}${searchParams}`, request.url),
      );
    } catch (error) {
      // If URL parsing fails, try treating it as a path
      if (decodedString.startsWith("/")) {
        if (!decodedString.startsWith("/caption/")) {
          return NextResponse.redirect(
            new URL(
              `/share/error?message=${encodeURIComponent(
                `Invalid path. Must start with /caption/. Got: ${decodedString}`,
              )}`,
              request.url,
            ),
          );
        }
        return NextResponse.redirect(new URL(decodedString, request.url));
      }

      return NextResponse.redirect(
        new URL(
          `/share/error?message=${encodeURIComponent(
            `Invalid URL format: ${error instanceof Error ? error.message : "Unknown error"}`,
          )}`,
          request.url,
        ),
      );
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.redirect(
      new URL(
        `/share/error?message=${encodeURIComponent(
          `Failed to process share link: ${errorMessage}`,
        )}`,
        request.url,
      ),
    );
  }
}
