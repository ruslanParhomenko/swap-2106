import { getSwaps } from "@/features/archive/actions/get-swaps";
import { ArchivePage } from "@/features/archive/ui/archive-page";
import { Suspense } from "react";

export default async function Page() {
  const swapsList = await getSwaps();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArchivePage swapsList={swapsList} />
    </Suspense>
  );
}
