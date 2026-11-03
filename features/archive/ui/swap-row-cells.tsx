import { Check, CheckCheck } from "lucide-react";
import { format } from "date-fns";
import type { GetSwapData } from "../actions/get-swaps";
import { shortName } from "@/utils/short-name";

type Props = {
  swap: GetSwapData["data"][number];
  idUser: string;
};

export function SwapRowCells({ swap, idUser }: Props) {
  return (
    <>
      <div>
        {swap.isAcceptedEmployee2 ? (
          <CheckCheck className="h-4 w-4 text-green-600" />
        ) : (
          <Check className="h-4 w-4 text-muted-foreground/40" />
        )}
      </div>
      <div
        className={
          swap.idEmployee2 === idUser ? "text-red-600" : "text-blue-500"
        }
      >
        {swap.date ? format(new Date(swap.date), "dd.MM") : "-"}
      </div>

      <div
        className={
          swap.idEmployee2 === idUser
            ? "text-red-600"
            : "text-blue-600 tracking-wider"
        }
      >
        {shortName(swap.employee)}
        {" = "}
        {swap.newShiftEmployee}
      </div>
      <div className="text-blue-400 text-[10px]">
        {swap.dateAcceptedEmployee2?.split(" ")[1]}
      </div>

      <div
        className={
          swap.idEmployee2 === idUser
            ? "text-red-600"
            : "text-blue-600 tracking-wider"
        }
      >
        {shortName(swap.employee2)} {" = "} {swap.newShiftEmployee2 || "_"}
      </div>

      <div className="text-blue-400 text-[10px]">
        {swap.dateRegister?.split(" ")[1]}
      </div>
    </>
  );
}
