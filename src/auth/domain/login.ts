import { z } from "zod"

export const loginCredentialsSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>

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

export type LoginResult =
  | {
      ok: true
      session: AuthSession
    }
  | {
      ok: false
      error: AuthFailure
    }