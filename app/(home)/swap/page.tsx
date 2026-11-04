import { getSchedulesActual } from "@/features/schedule/actions/get-schedules";
import { SwapPage } from "@/features/swap";
import { authOptions } from "@/lib/auth";
import { MONTHS } from "@/utils/get-month-days";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

const ROLE_KEY = {
  waiters: "bar",
  barmen: "bar",
  admin: "admin",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center text-muted-foreground">
          Loading...
        </div>
      }
    >
      <SwapContent />
    </Suspense>
  );
}

async function SwapContent() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const roleKey = ROLE_KEY[role as keyof typeof ROLE_KEY];

  if (!roleKey) {
    return (
      <div className="flex justify-center items-center text-muted-foreground">
        Failed to load role
      </div>
    );
  }

  const now = new Date();

  const schedules = await getSchedulesActual({
    year: String(now.getFullYear()),
    month: MONTHS[now.getMonth()],
    roleKey,
  });

  return <SwapPage schedules={schedules} />;
}
