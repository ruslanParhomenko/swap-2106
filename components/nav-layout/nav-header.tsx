import LogOutButton from "../buttons/logout-button";
import ThemesButton from "../buttons/themes-button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function NavHeader() {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name;

  return (
    <div className="my-1 flex justify-between items-center px-2">
      <LogOutButton />
      <span className="text-xs font-bold">{userName}</span>
      <ThemesButton />
    </div>
  );
}
