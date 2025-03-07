import NextAuth from "next-auth"
import { authOptions } from "./options"

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}



















// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         try {
//           const res = await fetch("https://8080-majeduldev-ecom-dxiwo2blvmm.ws-us117.gitpod.io/api/signin", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               email: credentials.email,
//               password: credentials.password,
//             }),
//           });

//           const data = await res.json();

//           if (data.success) {
//             return {
//               id: data.data.id,
//               email: data.data.email,
//               name: data.data.name,
//               role: data.data.role,
//               token: data.data.token,
//             };
//           } else {
//             throw new Error(data.message || "Login failed");
//           }
//         } catch (error) {
//           throw new Error(error.message || "Something went wrong");
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//         token.name = user.name;
//         token.role = user.role;
//         token.accessToken = user.token;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user.id = token.id;
//       session.user.email = token.email;
//       session.user.name = token.name;
//       session.user.role = token.role;
//       session.user.accessToken = token.accessToken;
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: "/login", // Customize login page if needed
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
