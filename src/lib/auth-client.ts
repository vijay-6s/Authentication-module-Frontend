// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/client"
import { jwtClient, organizationClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: "http://localhost:8000/api/v1/auth",
  plugins: [jwtClient(),  organizationClient()],
})

export const { signIn, signOut, useSession } = authClient
