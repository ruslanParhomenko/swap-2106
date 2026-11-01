import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { getEmployees } from "@/app/actions/get-employee";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

async function resolveUser(email?: string | null) {
  const mail = email;
  if (!mail) return null;

  if (ADMIN_EMAIL && mail === ADMIN_EMAIL) {
    return { role: "admin", name: "admin", email: mail };
  }

  const employees = (await getEmployees()).filter((u) => u.status);
  const dbUser = employees.find((u) => u.mail?.toLowerCase() === mail);

  return dbUser
    ? { role: dbUser.role, name: dbUser.name, email: mail, id: dbUser.id }
    : null;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 12,
  },
  pages: {
    signIn: "/signin",
  },
  debug: false,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const user = await resolveUser(profile.email);
        if (user) Object.assign(token, user);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
