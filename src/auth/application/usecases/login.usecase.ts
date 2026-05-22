import type { LoginCredentials, LoginResult } from "../../domain/login"
import type { AuthGateway } from "../../domain/ports/auth-gateway.port"

export class LoginUseCase {
  constructor(private readonly gateway: AuthGateway) {}

  async execute(credentials: LoginCredentials): Promise<LoginResult> {
    return this.gateway.login({
      ...credentials,
      email: credentials.email.toLowerCase(),
    })
  }
}