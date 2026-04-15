import { SignJWT, jwtVerify } from "jose";

if (!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET missing");

const secret = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function createSession(userId, email, name, status, expiryDate) {
  const expiryStr = expiryDate instanceof Date
    ? expiryDate.toISOString()
    : expiryDate ?? null;

  return await new SignJWT({ userId, email, name, status, expiryDate: expiryStr })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

export async function getSession(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}