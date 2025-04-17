import axios from "axios";
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
          const res = await axios.post(
            `${process.env.BACKEND_URL}/api/signin`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            { withCredentials: true }
          );
          console.log(res)
          const data = res.data;

          if (data) {
            return {
              // Extract user details and token from data.data
              id: data.data.id,
              name: data.data.name,
              email: data.data.email,
              token: data.data.token, // <– Token is extracted here
            };
          } else {
            return null;
          }
        } catch (error) {
          throw new Error(error.message || "Something went wrong");
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
          expiresAt: Date.now() + 1 * 60 * 60 * 1000
        };
      }

      if (token.expiresAt && Date.now() > token.expiresAt) {
        return {};
      }

      return token;
    },
    async session({ session, token }) {
      if (!token.accessToken) {
        return {};
      }

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
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
