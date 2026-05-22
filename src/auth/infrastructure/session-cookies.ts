import { cookies } from "next/headers"

import type { AuthSession } from "../domain/login"

export const AUTH_ACCESS_TOKEN_COOKIE = "tm-auth-access-token"
export const AUTH_REFRESH_TOKEN_COOKIE = "tm-auth-refresh-token"

const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30

const cookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
}

export async function persistSessionCookies(session: AuthSession) {
  const cookieStore = await cookies()

  cookieStore.set(AUTH_ACCESS_TOKEN_COOKIE, session.accessToken, {
    ...cookieOptions,
    maxAge: session.expiresIn,
  })

  cookieStore.set(AUTH_REFRESH_TOKEN_COOKIE, session.refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  })
}