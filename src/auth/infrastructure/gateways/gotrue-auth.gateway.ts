import { AuthClient, type AuthSession as SupabaseAuthSession } from "@supabase/supabase-js"

import { config } from "@src/shared/infrastructure/config"

import type { AuthGateway } from "../../domain/ports/auth-gateway.port"
import type { AuthFailure, AuthSession, LoginResult } from "../../domain/login"

const AUTH_CONFIGURATION_ERROR: AuthFailure = {
  code: "configuration_error",
  message: "Authentication is not configured.",
}

const AUTH_SERVICE_UNAVAILABLE_ERROR: AuthFailure = {
  code: "service_unavailable",
  message: "The auth service is temporarily unavailable.",
}

const INVALID_SESSION_ERROR: AuthFailure = {
  code: "unexpected_error",
  message: "The auth service returned an invalid session.",
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null
}

function readNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function toFailure(status: number | null): AuthFailure {
  if (status === 429) {
    return {
      code: "rate_limited",
      message: "Too many sign-in attempts. Try again in a moment.",
    }
  }

  if (
    status === 400 ||
    status === 401 ||
    status === 403 ||
    status === 404 ||
    status === 422
  ) {
    return {
      code: "invalid_credentials",
      message: "Invalid email or password.",
    }
  }

  if (status !== null && status >= 500) {
    return AUTH_SERVICE_UNAVAILABLE_ERROR
  }

  return {
    code: "unexpected_error",
    message: "Unable to sign in right now. Please try again.",
  }
}

function toSession(payload: SupabaseAuthSession | null): AuthSession | null {
  if (!payload) {
    return null
  }

  const accessToken = readString(payload.access_token)
  const refreshToken = readString(payload.refresh_token)
  const tokenType = readString(payload.token_type) ?? "bearer"
  const expiresIn = readNumber(payload.expires_in)

  if (!accessToken || !refreshToken || expiresIn === null) {
    return null
  }

  return {
    accessToken,
    refreshToken,
    tokenType,
    expiresIn,
  }
}

function createAuthClient(baseUrl: string | null) {
  if (!baseUrl) {
    return null
  }

  try {
    return new AuthClient({
      url: new URL(baseUrl).href,
      headers: {
        apikey: config.auth.supabaseAnonKey,
      },
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    })
  } catch {
    return null
  }
}

export function createGoTrueAuthGateway(baseUrl: string | null): AuthGateway {
  const authClient = createAuthClient(baseUrl)

  if (!authClient) {
    return {
      async login() {
        return {
          ok: false,
          error: AUTH_CONFIGURATION_ERROR,
        }
      },
    }
  }

  return {
    async login(credentials): Promise<LoginResult> {
      try {
        const { data, error } = await authClient.signInWithPassword(credentials)

        if (error) {
          return {
            ok: false,
            error: toFailure(typeof error.status === "number" ? error.status : null),
          }
        }

        const session = toSession(data.session)

        if (!session) {
          return {
            ok: false,
            error: INVALID_SESSION_ERROR,
          }
        }

        return {
          ok: true,
          session,
        }
      } catch {
        return {
          ok: false,
          error: AUTH_SERVICE_UNAVAILABLE_ERROR,
        }
      }
    },
  }
}