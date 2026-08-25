import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const flowId = request.nextUrl.searchParams.get("sb_flow_id");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(
      code,
      flowId ? { flowId } : undefined,
    );

    if (!error) {
      const resetPasswordUrl = request.nextUrl.clone();
      resetPasswordUrl.pathname = "/reset-password";
      resetPasswordUrl.search = "";

      return NextResponse.redirect(resetPasswordUrl);
    }
  }

  const forgotPasswordUrl = request.nextUrl.clone();
  forgotPasswordUrl.pathname = "/forgot-password";
  forgotPasswordUrl.search = "";
  forgotPasswordUrl.searchParams.set("error", "invalid_link");

  return NextResponse.redirect(forgotPasswordUrl);
}
