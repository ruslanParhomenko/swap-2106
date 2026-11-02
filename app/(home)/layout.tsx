import { Suspense } from "react";
import NavHeader from "@/components/nav-layout/nav-header";
import NavFooter from "@/components/nav-layout/nav-footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh md:px-8 flex-col justify-between">
      <Suspense fallback={<div>...</div>}>
        <NavHeader />
      </Suspense>
      <div className="flex flex-1 justify-center">{children}</div>
      <Suspense fallback={null}>
        <NavFooter />
      </Suspense>
    </div>
  );
}
