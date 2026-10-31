import SwapListTable from "@/features/archive-swap/swap-list-table";
import { GetSwapData } from "../actions/get-swaps";
import { GetEmployees } from "@/app/actions/get-employee";

export function ArchiveSwapPage({
  employees,
  swapsList,
}: {
  employees: GetEmployees[];
  swapsList: GetSwapData[];
}) {
  return <SwapListTable swapsList={swapsList} employees={employees} />;
}
