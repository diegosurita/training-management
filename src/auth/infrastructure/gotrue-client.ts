import type { LoginGateway } from "../application/login"
import type { AuthFailure, AuthSession, LoginResult } from "../domain/login"

const GO_TRUE_TOKEN_PATH = "/token?grant_type=password"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null
}

function readNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function toFailure(status: number): AuthFailure {
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

  if (status >= 500) {
    return {
      code: "service_unavailable",
      message: "The auth service is temporarily unavailable.",
    }
  }

  return {
    code: "unexpected_error",
    message: "Unable to sign in right now. Please try again.",
  }
}

function toSession(payload: Record<string, unknown>): AuthSession | null {
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

export function createGoTrueAuthGateway(baseUrl: string): LoginGateway {
  const authBaseUrl = new URL(baseUrl)

  return {
    async login(credentials): Promise<LoginResult> {
      try {
        const response = await fetch(new URL(GO_TRUE_TOKEN_PATH, authBaseUrl), {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
          cache: "no-store",
        })

        const payload = (await response.json().catch(() => null)) as
          | Record<string, unknown>
          | null

        if (!response.ok) {
          return {
            ok: false,
            error: toFailure(response.status),
          }
        }

        if (!isRecord(payload)) {
          return {
            ok: false,
            error: {
              code: "unexpected_error",
              message: "The auth service returned an invalid session.",
            },
          }
        }

        const session = toSession(payload)

        if (!session) {
          return {
            ok: false,
            error: {
              code: "unexpected_error",
              message: "The auth service returned an invalid session.",
            },
          }
        }

        return {
          ok: true,
          session,
        }
      } catch {
        return {
          ok: false,
          error: {
            code: "service_unavailable",
            message: "The auth service is temporarily unavailable.",
          },
        }
      }
    },
  }
}