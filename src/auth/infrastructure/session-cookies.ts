import { cookies } from "next/headers"

import type { AuthSession } from "../domain/login"
import { config } from "@src/shared/infrastructure/config"

const cookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
}

export async function persistSessionCookies(session: AuthSession) {
  const cookieStore = await cookies()

  cookieStore.set(config.cookies.authAccessTokenCookie, session.accessToken, {
    ...cookieOptions,
    maxAge: session.expiresIn,
  })

  cookieStore.set(config.cookies.authRefreshTokenCookie, session.refreshToken, {
    ...cookieOptions,
    maxAge: config.cookies.authRefreshTokenMaxAge,
  })
}