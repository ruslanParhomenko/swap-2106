import { getEmployees } from "@/app/actions/get-employee";
import { getSwapsByKey } from "@/app/actions/swap-action";
import { ArchiveSwapPage } from "@/features/archive";
import { Suspense } from "react";

export default async function Page() {
  const dateNow = new Date();
  const year = dateNow.getFullYear().toString();
  const monthNumber = dateNow.getMonth() + 1;

  const swapsList = await getSwapsByKey(`${year}-${monthNumber}`);
  const employees = (await getEmployees()) as {
    id: string;
    name: string;
    role: string;
    mail: string;
  }[];
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArchiveSwapPage swapsList={swapsList} employees={employees} />
    </Suspense>
  );
}
