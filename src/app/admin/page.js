import { auth, signOut } from "@/auth";
import AdminForms from "./AdminForms";

export const metadata = { title: 'Administration | Sport Santé' };

export default async function AdminPage() {
  const session = await auth();

  async function logout() {
    'use server';
    await signOut({ redirectTo: '/' });
  }

  return (
    <AdminForms
      userName={session?.user?.name || session?.user?.email || 'Admin'}
      logoutAction={logout}
    />
  );
}
