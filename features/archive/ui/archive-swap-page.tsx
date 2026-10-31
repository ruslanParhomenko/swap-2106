import { SwapActionType } from "@/app/actions/swap-action";
import SwapListTable from "@/features/archive-swap/swap-list-table";
import { GetSwapData } from "../actions/get-swaps";

export function ArchiveSwapPage({
  employees,
  swapsList,
}: {
  employees: { id: string; name: string; role: string; mail: string }[];
  swapsList: GetSwapData[];
}) {
  return <SwapListTable swapsList={swapsList} employees={employees} />;
}
