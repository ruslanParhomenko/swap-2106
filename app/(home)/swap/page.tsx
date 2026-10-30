import { getEmployees } from "@/app/actions/get-employee";
import { getSchedulesActual } from "@/features/schedule/actions/get-schedules";
import { SwapPage } from "@/features/swap";
import { authOptions } from "@/lib/auth";
import { MONTHS } from "@/utils/get-month-days";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

const ROLE_KEY = {
  waiter: "bar",
  barmen: "bar",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SwapContent />
    </Suspense>
  );
}

async function SwapContent() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Failed to load session</div>;
  }

  const role = session?.user?.role;
  const employees = await getEmployees();

  if (!employees) {
    return <div>Failed to load employees</div>;
  }

  const roleKey = ROLE_KEY[role as keyof typeof ROLE_KEY];

  if (!roleKey) {
    return <div>Failed to load role</div>;
  }

  const now = new Date();

  const schedules = await getSchedulesActual({
    year: String(now.getFullYear()),
    month: MONTHS[now.getMonth()],
    roleKey,
  });

  return <SwapPage schedules={schedules} employees={employees} session={session} />;
}
