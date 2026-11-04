"use client";
import { Label } from "@/components/ui/label";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

export const NoAccess = ({ exitButton }: { exitButton?: boolean }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-dvh">
      <Label className="text-center text-2xl text-red-600 py-2">
        {" "}
        not access{" "}
      </Label>
      {exitButton && (
        <Button
          type="button"
          variant={"destructive"}
          className="text-white cursor-pointer font-bold"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          exit
        </Button>
      )}
    </div>
  );
};
