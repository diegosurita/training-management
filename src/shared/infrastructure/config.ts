export const config = {
  auth: {
    supabaseUrl: process.env.SUPABASE_URL?.trim() || null,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY?.trim() || "public-anon-key",
  },
  cookies: {
    authAccessTokenCookie: "tm-auth-access-token",
    authRefreshTokenCookie: "tm-auth-refresh-token",
    authRefreshTokenMaxAge: 60 * 60 * 24 * 30,
  },
} as const