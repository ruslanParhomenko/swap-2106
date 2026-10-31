"use client";

import { Fragment, useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { format, parse } from "date-fns";
import { SHIFT_VALUES } from "./constants";

import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Check, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { GetSwapData } from "../archive/actions/get-swaps";
import { updateEmployeeAcceptance } from "./actions/update-swap-accept";
import { updateSwapStatusAdmin } from "./actions/update-swap-admin";

// В клиентском компоненте доступны только NEXT_PUBLIC_* переменные
const userEmail = process.env.NEXT_PUBLIC_USER_EMAIL;

const SWIPE_THRESHOLD = 0.35; // доля ширины строки для срабатывания
const SWIPE_MAX = 0.5; // максимальный сдвиг (доля ширины)
const GRID_COLS = "32px 1.3fr 1fr 24px 1fr 44px 28px 40px";
export default function SwapListTable({
  swapsList,
  employees,
}: {
  swapsList: GetSwapData[];
  employees: { id: string; name: string; role: string; mail: string }[];
}) {
  const [collapsed, setCollapsed] = useState<string[]>([]);

  const { data: session } = useSession();
  const emailUser = session?.user?.email;
  const idUser = session?.user?.id!;

  const isAdmin = !!userEmail && emailUser === userEmail;

  const sortedList = [...swapsList].sort((a, b) => b.id.localeCompare(a.id));

  return (
    <Table>
      <TableBody>
        {sortedList.map((doc) => {
          const isCollapsed = collapsed.includes(doc.id);

          const sortedData = [...doc.data].sort(
            (a, b) =>
              parse(b.dateRegister, "dd.MM.yyyy HH:mm", new Date()).getTime() -
              parse(a.dateRegister, "dd.MM.yyyy HH:mm", new Date()).getTime(),
          );

          return (
            <Fragment key={doc.id}>
              <TableRow
                className="cursor-pointer bg-muted/50"
                onClick={() =>
                  setCollapsed((prev) =>
                    prev.includes(doc.id)
                      ? prev.filter((id) => id !== doc.id)
                      : [...prev, doc.id],
                  )
                }
              >
                <TableCell
                  colSpan={8}
                  className="py-2 text-sm font-bold text-bl"
                >
                  {format(new Date(`${doc.id}-01`), "LLLL yyyy")}
                  <span className="ml-2 font-normal text-muted-foreground">
                    ({doc.data.length})
                  </span>
                </TableCell>
              </TableRow>

              {!isCollapsed &&
                sortedData.map((swap) => {
                  const IconComponent =
                    SHIFT_VALUES[swap.typeSwap as keyof typeof SHIFT_VALUES];

                  return (
                    <SwapRow
                      key={swap.id}
                      docId={doc.id.split("-").slice(0, 2).join("-")}
                      swap={swap}
                      isAdmin={isAdmin}
                      idUser={idUser}
                      IconComponent={IconComponent}
                    />
                  );
                })}
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}

function SwapRow({
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
  const [pending, setPending] = useState(false);
  const [offset, setOffset] = useState(0); // >0 вправо, <0 влево

  const startX = useRef(0);
  const rowWidth = useRef(0);
  const currentDelta = useRef(0);
  const pointerId = useRef<number | null>(null);

  const isAccepted = swap.isAcceptedEmployee2;
  const isOwner = true; // Для теста
  const isChecked = !!swap.isAcceptedAdmin;

  const canRight = isOwner && !isAccepted;
  // const canLeft = isAdmin && !isChecked;
  const canLeft = true;

  const passed =
    Math.abs(offset) >= rowWidth.current * SWIPE_THRESHOLD && offset !== 0;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((!canRight && !canLeft) || pending) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    pointerId.current = e.pointerId;
    startX.current = e.clientX;
    rowWidth.current = e.currentTarget.getBoundingClientRect().width;
    currentDelta.current = 0;

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== e.pointerId) return;

    const delta = e.clientX - startX.current;
    const max = rowWidth.current * SWIPE_MAX;
    const min = canLeft ? -max : 0;
    const upper = canRight ? max : 0;

    currentDelta.current = Math.max(min, Math.min(delta, upper));
    setOffset(currentDelta.current);
  };

  const resetSwipe = () => {
    pointerId.current = null;
    currentDelta.current = 0;
    setOffset(0);
  };

  const handlePointerUp = async (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== e.pointerId) return;

    const delta = currentDelta.current;
    const shouldAccept = Math.abs(delta) >= rowWidth.current * SWIPE_THRESHOLD;

    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    resetSwipe();

    if (!shouldAccept || pending) return;

    if (delta > 0 && canRight) {
      setPending(true);
      try {
        const result = await updateEmployeeAcceptance(docId, swap.id);
        if (result?.error) {
          toast.error("Не удалось подтвердить замену");
          return;
        }
        toast.success("Замена подтверждена");
      } catch {
        toast.error("Ошибка подтверждения");
      } finally {
        setPending(false);
      }
    }

    if (delta < 0 && canLeft) {
      setPending(true);
      try {
        await updateSwapStatusAdmin(docId, swap.id, true);
        toast.success("Подтверждено админом");
      } catch {
        toast.error("Ошибка подтверждения");
      } finally {
        setPending(false);
      }
    }
  };

  const short = (name: string) =>
    `${name.split(" ")[0]} ${name.split(" ")[1]?.[0] || ""}`;

  const isRight = offset > 0;

  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={8} className="p-0">
        <div className="relative overflow-hidden">
          {/* Фон под строкой */}
          <div
            className={cn(
              "absolute inset-0 flex items-center px-4 transition-colors",
              isRight ? "justify-start" : "justify-end",
              isRight
                ? passed
                  ? "bg-green-600"
                  : "bg-green-500/60"
                : passed
                  ? "bg-blue-600"
                  : "bg-blue-500/60",
            )}
            style={{ opacity: offset !== 0 ? 1 : 0 }}
          >
            <CheckCheck
              className={cn(
                "h-5 w-5 text-white transition-transform",
                passed ? "scale-125" : "scale-90",
              )}
            />
          </div>

          {/* Подвижная строка */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={resetSwipe}
            className={cn(
              "relative z-10 grid items-center bg-background px-1 py-3 text-xs",
              isChecked && "text-muted-foreground **:text-muted-foreground",
              isAccepted && "opacity-60",
              (canRight || canLeft) && "cursor-grab",
              pending && "opacity-50",
            )}
            style={{
              gridTemplateColumns: GRID_COLS,
              touchAction: "pan-y",
              userSelect: "none",
              transform: `translateX(${offset}px)`,
              transition: offset ? "none" : "transform 200ms ease",
            }}
          >
            <div>
              {isAccepted ? (
                <CheckCheck className="h-4 w-4 text-green-600" />
              ) : (
                <Check className="h-4 w-4 text-muted-foreground/40" />
              )}
            </div>
            <div className="text-blue-500">{swap.dateRegister}</div>
            <div>{short(swap.employee)}</div>
            <div>
              {IconComponent ? (
                <IconComponent className="h-3 w-3 text-red-500" />
              ) : (
                "-"
              )}
            </div>
            <div>{short(swap.employee2)}</div>
            <div className="text-yellow-700">
              {swap.date ? format(new Date(swap.date), "dd.MM") : "-"}
            </div>
            <div className="text-center font-bold text-bl">{swap.shift}</div>
            <div className="flex justify-center pr-2">
              {isChecked && <Check className="h-4 w-4 text-green-600!" />}
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
