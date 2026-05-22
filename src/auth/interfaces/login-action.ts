'use server'

import { redirect } from "next/navigation"

import { createLoginUseCase } from "../application/login"
import { loginCredentialsSchema, type LoginResult } from "../domain/login"
import { createGoTrueAuthGateway } from "../infrastructure/gotrue-client"
import { persistSessionCookies } from "../infrastructure/session-cookies"

export type LoginActionResult =
  | {
      ok: true
    }
  | {
      ok: false
      error: string
    }

function getAuthServiceUrl() {
  return process.env.SUPABASE_URL?.trim() || null
}

function toErrorResult(message: string): LoginActionResult {
  return {
    ok: false,
    error: message,
  }
}

export async function loginAction(input: unknown): Promise<LoginActionResult> {
  const parsedCredentials = loginCredentialsSchema.safeParse(input)

  if (!parsedCredentials.success) {
    return toErrorResult(
      parsedCredentials.error.issues[0]?.message ??
        "Check your credentials and try again."
    )
  }

  const authServiceUrl = getAuthServiceUrl()

  if (!authServiceUrl) {
    return toErrorResult("Authentication is not configured.")
  }

  try {
    const loginUseCase = createLoginUseCase(createGoTrueAuthGateway(authServiceUrl))
    const result: LoginResult = await loginUseCase.execute(parsedCredentials.data)

    if (!result.ok) {
      return toErrorResult(result.error.message)
    }

    await persistSessionCookies(result.session)
  } catch {
    return toErrorResult("Unable to sign in right now. Please try again.")
  }

  redirect("/dashboard")
}