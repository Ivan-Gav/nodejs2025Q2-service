export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  message?: string;
  tokens?: Tokens;
}
