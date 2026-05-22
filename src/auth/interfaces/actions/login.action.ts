import { redirect } from "next/navigation"
import { z } from "zod"

import { LoginUseCase } from "../../application/usecases/login.usecase"
import type { LoginResult } from "../../domain/login"
import { createGoTrueAuthGateway } from "../../infrastructure/gateways/gotrue-auth.gateway"
import { persistSessionCookies } from "../../infrastructure/session-cookies"
import { config } from "@src/shared/infrastructure/config"

export const loginCredentialsSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>

export type LoginActionResult =
  | {
      ok: true
    }
  | {
      ok: false
      error: string
    }

type LoginActionErrorResult = Extract<LoginActionResult, { ok: false }>

type ParsedCredentialsResult =
  | {
      ok: true
      data: LoginCredentials
    }
  | LoginActionErrorResult

function toErrorResult(message: string): LoginActionErrorResult {
  return {
    ok: false,
    error: message,
  }
}

function parseCredentials(input: unknown): ParsedCredentialsResult {
  const parsedCredentials = loginCredentialsSchema.safeParse(input)

  if (!parsedCredentials.success) {
    return toErrorResult(
      parsedCredentials.error.issues[0]?.message ??
        "Check your credentials and try again."
    )
  }

  return {
    ok: true,
    data: parsedCredentials.data,
  }
}

async function signIn(
  credentials: LoginCredentials,
  loginUseCase: LoginUseCase
): Promise<LoginActionResult> {
  try {
    const result: LoginResult = await loginUseCase.execute(credentials)

    if (!result.ok) {
      return toErrorResult(result.error.message)
    }

    await persistSessionCookies(result.session)

    return {
      ok: true,
    }
  } catch {
    return toErrorResult("Unable to sign in right now. Please try again.")
  }
}

const loginUseCase = new LoginUseCase(createGoTrueAuthGateway(config.auth.supabaseUrl))

export async function loginAction(input: unknown): Promise<LoginActionResult> {
  'use server'

  const parsedCredentials = parseCredentials(input)

  if (!parsedCredentials.ok) {
    return parsedCredentials
  }

  const result = await signIn(parsedCredentials.data, loginUseCase)

  if (!result.ok) {
    return result
  }

  redirect("/dashboard")
}