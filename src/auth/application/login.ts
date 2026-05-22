import type { LoginCredentials, LoginResult } from "../domain/login"

export interface LoginGateway {
  login(credentials: LoginCredentials): Promise<LoginResult>
}

export interface LoginUseCase {
  execute(credentials: LoginCredentials): Promise<LoginResult>
}

export function createLoginUseCase(gateway: LoginGateway): LoginUseCase {
  return {
    async execute(credentials) {
      return gateway.login({
        ...credentials,
        email: credentials.email.toLowerCase(),
      })
    },
  }
}