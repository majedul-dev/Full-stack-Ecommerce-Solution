import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await fetch(`${process.env.BACKEND_URL}/api/signin`, {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include" // Equivalent to axios' withCredentials
          });

          if (!response.ok) {
            throw new Error(await response.text());
          }

          const data = await response.json();

          return {
            id: data.data.id,
            name: data.data.name,
            email: data.data.email,
            token: data.data.token,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          accessToken: user.token,
          expiresAt: Date.now() + 3600 * 1000 // 1 hour expiration
        };
      }

      // Token auto-refresh logic (optional)
      if (token.expiresAt && Date.now() > token.expiresAt - 30000) {
        // Refresh token 30 seconds before expiration
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
      };
      session.accessToken = token.accessToken;
      session.expires = new Date(token.expiresAt).toISOString();
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login?error=true" // Custom error page
  },
  session: {
    strategy: "jwt",
    maxAge: 3600 // 1 hour
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};