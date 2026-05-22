export type AuthErrorCode =
  | "invalid_credentials"
  | "rate_limited"
  | "service_unavailable"
  | "configuration_error"
  | "unexpected_error"

export type AuthFailure = {
  code: AuthErrorCode
  message: string
}

export type AuthSession = {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

export type LoginCredentials = {
  email: string
  password: string
}

export type LoginResult =
  | {
      ok: true
      session: AuthSession
    }
  | {
      ok: false
      error: AuthFailure
    }