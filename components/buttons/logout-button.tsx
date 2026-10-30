"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogOutButton() {
  return (
    <div className="flex items-center justify-center">
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex h-7 cursor-pointer items-center justify-center"
      >
        <LogOut className="h-4 w-4 font-bold text-red-600" />
      </button>
    </div>
  );
}
