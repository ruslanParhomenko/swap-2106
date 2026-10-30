import { SwapActionType } from "@/app/actions/swap-action";
import SwapListTable from "@/features/swap-list/swap-list-table";

export function ArchiveSwapPage({
  employees,
  swapsList,
}: {
  employees: { id: string; name: string; role: string; mail: string }[];
  swapsList: SwapActionType[];
}) {
  return <SwapListTable swapsList={swapsList} employees={employees} />;
}
