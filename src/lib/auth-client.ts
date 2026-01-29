// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/client";
import { jwtClient, organizationClient } from "better-auth/client/plugins";
import { genericOAuthClient } from "better-auth/client/plugins";
import { magicLinkClient } from "better-auth/client/plugins";
export const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // Changed from /auth to root

  // 🔴 REQUIRED for cookie-based sessions
  fetchOptions: {
    credentials: "include",
  },

  plugins: [
    jwtClient(),
    organizationClient(),
    genericOAuthClient(),
    magicLinkClient()
  ],
});

export const { signIn, signOut, useSession } = authClient;
