import type { LoginCredentials, LoginResult } from "../login"

export interface AuthGateway {
  login(credentials: LoginCredentials): Promise<LoginResult>
}
