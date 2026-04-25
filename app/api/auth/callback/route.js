import { google } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, preActivations } from "@/lib/schema";
import { createSession } from "@/lib/session";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function redirectWithCookie(request, path, token) {
  const response = NextResponse.redirect(new URL(path, request.url));
  response.cookies.set("session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const cookieStore = await cookies();
  const savedState = cookieStore.get("google_state")?.value;
  const codeVerifier = cookieStore.get("google_code_verifier")?.value;

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(new URL("/login?error=invalid", request.url));
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const accessToken = tokens.accessToken();

    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    const googleUser = await userRes.json();

    let result = await db
      .select()
      .from(users)
      .where(eq(users.googleId, googleUser.id));

    if (result.length === 0) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);

      await db.insert(users).values({
        googleId: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        image: googleUser.picture,
        active: 0,
        status: "trial",
        expiryDate: expiry.toISOString(),
        reminderSent: "no",
      });

      const preAct = await db
        .select()
        .from(preActivations)
        .where(eq(preActivations.email, googleUser.email))
        .limit(1);

      if (preAct.length > 0) {
        const newExpiry = new Date();
        newExpiry.setFullYear(newExpiry.getFullYear() + 1);

        await db
          .update(users)
          .set({
            status: "active",
            active: 1,
            expiryDate: newExpiry.toISOString(),
            reminderSent: "no",
          })
          .where(eq(users.email, googleUser.email));

        await db
          .delete(preActivations)
          .where(eq(preActivations.email, googleUser.email));
      }

      result = await db
        .select()
        .from(users)
        .where(eq(users.googleId, googleUser.id));
    }

    const user = result[0];

    const token = await createSession(
      user.id,
      user.email,
      user.name,
      user.status,
      user.expiryDate,
    );

    if (user.email === "prasad.kamta@gmail.com") {
      return redirectWithCookie(request, "/dashboard", token);
    }

    if (user.active === 1 && user.status === "active") {
      return redirectWithCookie(request, "/dashboard", token);
    }

    const now = new Date();
    const expiryDate = user.expiryDate ? new Date(user.expiryDate) : null;

    if (user.status === "trial" && expiryDate && now < expiryDate) {
      return redirectWithCookie(request, "/dashboard", token);
    }

    return redirectWithCookie(request, "/expired", token);
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(new URL("/login?error=failed", request.url));
  }
}
