import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const flowId = request.nextUrl.searchParams.get("sb_flow_id");
  const hasNextPath = request.nextUrl.searchParams.has("next");
  const requestedNextPath = request.nextUrl.searchParams.get("next");
  const fallbackNextUrl = new URL("/", request.url);
  const requestedNextUrl = requestedNextPath?.startsWith("/")
    ? new URL(requestedNextPath, request.url)
    : fallbackNextUrl;
  const nextUrl =
    requestedNextUrl.origin === request.nextUrl.origin
      ? requestedNextUrl
      : fallbackNextUrl;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(
      code,
      flowId ? { flowId } : undefined,
    );

    if (!error) {
      if (hasNextPath) {
        return NextResponse.redirect(nextUrl);
      }

      const resetPasswordUrl = request.nextUrl.clone();
      resetPasswordUrl.pathname = "/reset-password";
      resetPasswordUrl.search = "";

      return NextResponse.redirect(resetPasswordUrl);
    }
  }

  if (hasNextPath) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("auth_error", "oauth_failed");

    return NextResponse.redirect(loginUrl);
  }

  const forgotPasswordUrl = request.nextUrl.clone();
  forgotPasswordUrl.pathname = "/forgot-password";
  forgotPasswordUrl.search = "";
  forgotPasswordUrl.searchParams.set("error", "invalid_link");

  return NextResponse.redirect(forgotPasswordUrl);
}
