import { Suspense } from "react";
import LogOutButton from "../buttons/logout-button";
import ThemesButton from "../buttons/themes-button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function NavHeader() {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name;
  const userRole = session?.user?.role;

  return (
    <div className="my-1 flex justify-between items-center px-2">
      <span className="text-xs text-bl px-2">{userRole}</span>
      <span className="text-xs font-bold">{userName}</span>

      <div className="flex gap-8 px-2">
        <LogOutButton />
        <ThemesButton />
      </div>
    </div>
  );
}
