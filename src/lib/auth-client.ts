// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/client"
import { jwtClient, organizationClient } from "better-auth/client/plugins"
import { genericOAuthClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [jwtClient(),  organizationClient(),genericOAuthClient()],
})

export const { signIn, signOut, useSession } = authClient
