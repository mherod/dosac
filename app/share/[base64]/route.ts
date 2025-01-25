import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  {
    params,
  }: { params: { base64: string } } & {
    searchParams: { [key: string]: string | string[] | undefined };
  },
) {
  try {
    // Decode the base64 URL
    const decodedString = Buffer.from(params.base64, "base64").toString();
    const url = new URL(decodedString);

    // Security check: Ensure URL is from the same origin
    if (url.origin !== request.nextUrl.origin) {
      return redirect("/");
    }

    // Extract the path and search params
    const path = url.pathname;
    const searchParams = url.search;

    // Redirect to the decoded URL
    return redirect(`${path}${searchParams}`);
  } catch {
    // If decoding fails, redirect to home
    return redirect("/");
  }
}
