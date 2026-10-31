import { getEmployees } from "@/app/actions/get-employee";
import { ArchiveSwapPage } from "@/features/archive";
import { getSwaps } from "@/features/archive/actions/get-swaps";
import { Suspense } from "react";

export default async function Page() {
  const swapsList = await getSwaps();
  const employees = await getEmployees()
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArchiveSwapPage swapsList={swapsList} employees={employees} />
    </Suspense>
  );
}
