import { google } from "@/lib/auth";
import { generateState, generateCodeVerifier } from "arctic";
import { cookies } from "next/headers";

export async function GET() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"]);

  const cookieStore = await cookies();
  cookieStore.set("oauth_state", state, { httpOnly: true, maxAge: 600, path: "/", sameSite: "lax", secure: true });
  cookieStore.set("code_verifier", codeVerifier, { httpOnly: true, maxAge: 600, path: "/", sameSite: "lax", secure: true });

  return Response.redirect(url.toString());
}