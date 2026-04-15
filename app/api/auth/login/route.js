import { google } from "@/lib/auth";
import { generateState, generateCodeVerifier } from "arctic";
import { NextResponse } from "next/server";

const isProduction = process.env.NODE_ENV === "production";

export async function GET() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"]);

  const response = NextResponse.redirect(url.toString());
  response.cookies.set("oauth_state", state, { httpOnly: true, maxAge: 600, path: "/", sameSite: "lax", secure: isProduction });
  response.cookies.set("code_verifier", codeVerifier, { httpOnly: true, maxAge: 600, path: "/", sameSite: "lax", secure: isProduction });

  return response;
}