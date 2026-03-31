import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Mot de passe administrateur",
      credentials: {
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        // We use an environment variable for the admin password, e.g. defined in Vercel
        if (credentials.password === process.env.ADMIN_PASSWORD) {
          return { id: "admin", name: "Administrateur" };
        }
        return null;
      }
    })
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      if (isOnAdmin) return isLoggedIn;
      return true;
    },
  },
});
