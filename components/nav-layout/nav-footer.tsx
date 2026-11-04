"use client";
import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSwipeable } from "react-swipeable";
import { TabsLine } from "../ui/tabs-line";
import { NAV_LINE_ITEMS } from "@/constants/nav-items";

export default function NavFooter() {
  const pathname = usePathname();
  const mainRoute = pathname.split("/")[1] || "";
  const initialTab = mainRoute;

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleTabChange = (value: string) => {
    startTransition(() => {
      router.replace(value, { scroll: false });
    });
  };

  const handlers = useSwipeable({
    delta: 50,
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    onSwipedLeft: () => {
      handleTabChange(NAV_LINE_ITEMS[1]);
    },
    onSwipedRight: () => {
      handleTabChange(NAV_LINE_ITEMS[0]);
    },
  });

  return (
    <div
      {...handlers}
      className="bg-background sticky bottom-2 z-20 flex items-center justify-center px-4 md:justify-start"
    >
      <TabsLine
        value={initialTab}
        onChange={(value: string) => handleTabChange(value)}
        disabled={isPending}
        options={NAV_LINE_ITEMS}
      />
    </div>
  );
}
