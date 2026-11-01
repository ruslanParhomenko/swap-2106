import type { GetSwapData } from "../actions/get-swaps";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useSwipeRow } from "../hooks/use-swipe-row";
import { SwipeBackground } from "./swipe-background";
import { useSwapActions } from "../hooks/use-swipe-actions";
import { SwapRowCells } from "./swap-row-cells";

const GRID_COLS = "6% 8% 30% 8% 30% 10%";

export default function ArchiveSwapRow({
  docId,
  swap,
  isAdmin,
  idUser,
  IconComponent,
}: {
  docId: string;
  swap: GetSwapData["data"][number];
  isAdmin: boolean;
  idUser?: string;
  IconComponent?: React.ElementType;
}) {
  const isAcceptedEmployee2 = swap.isAcceptedEmployee2;
  const isAcceptedAdmin = swap.isAcceptedAdmin;
  const isOwnerSwap = idUser === swap.idEmployee2;

  const canRight = isOwnerSwap && !isAcceptedEmployee2 && !isAcceptedAdmin;
  const canLeft = isAdmin && !isAcceptedAdmin && isAcceptedEmployee2;

  const { pending, acceptByEmployee, acceptByAdmin } = useSwapActions(
    docId,
    swap.id,
  );

  const { offset, passed, isRight, swiping, canSwipe, handlers } = useSwipeRow({
    canRight,
    canLeft,
    disabled: pending,
    onSwipeRight: acceptByEmployee,
    onSwipeLeft: acceptByAdmin,
  });

  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={6} className="p-0">
        <div className="relative overflow-hidden">
          <SwipeBackground isRight={isRight} passed={passed} visible={true} />

          <div
            {...handlers}
            className={cn(
              "relative z-10 grid items-center justify-between text-center bg-background px-1 py-3 text-xs",
              isAcceptedAdmin &&
                "**:text-muted-foreground! [&_svg]:text-muted-foreground!",
              isAcceptedEmployee2 && "**:text-green-600!",
              canSwipe && "cursor-grab",
              pending && "opacity-50",
            )}
            style={{
              gridTemplateColumns: GRID_COLS,
              touchAction: "pan-y",
              userSelect: "none",
              transform: `translateX(${offset}px)`,
              transition: swiping ? "none" : "transform 200ms ease",
            }}
          >
            <SwapRowCells swap={swap} IconComponent={IconComponent} />
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
