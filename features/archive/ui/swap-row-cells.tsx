import { Check, CheckCheck } from "lucide-react";
import { format } from "date-fns";
import type { GetSwapData } from "../actions/get-swaps";
import { shortName } from "@/utils/short-name";

type Props = {
  swap: GetSwapData["data"][number];
  IconComponent?: React.ElementType;
};

export function SwapRowCells({ swap, IconComponent }: Props) {
  return (
    <>
      <div>
        {swap.isAcceptedEmployee2 ? (
          <CheckCheck className="h-4 w-4 text-green-600" />
        ) : (
          <Check className="h-4 w-4 text-muted-foreground/40" />
        )}
      </div>
      <div className="text-blue-400 text-[10px]">
        {swap.dateRegister?.split(" ")[1]}
      </div>
      <div className="text-blue-600">{shortName(swap.employee)}</div>
      <div className="flex justify-center">
        {IconComponent ? (
          <IconComponent className="h-3 w-3 text-blue-700" />
        ) : (
          "-"
        )}
      </div>
      <div className="text-blue-600">{shortName(swap.employee2)}</div>
      <div className="text-blue-600">
        {swap.date ? format(new Date(swap.date), "dd.MM") : "-"}
      </div>
    </>
  );
}
