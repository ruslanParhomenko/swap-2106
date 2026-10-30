"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { SHIFT_VALUES } from "./constants";
import {
  SwapActionType,
  updateRefuseStatus,
  updateSwapStatus,
} from "@/app/actions/swap-action";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

const userEmail = process.env.USER_EMAIL;

export default function SwapListTable({
  swapsList,
  employees,
}: {
  swapsList: SwapActionType[];
  employees: { id: string; name: string; role: string; mail: string }[];
}) {

  console.log("swapsList", swapsList);
  const { data: session } = useSession();
  const emailUser = session?.user?.email;

  const idUser = employees.find((e) => e.mail === emailUser)?.id;

  const isAdmin = emailUser === userEmail;
  const reversedList = [...swapsList].reverse();

  return (
    <Table>
      <TableBody>
        {reversedList.map((swap) => {
          const IconComponent =
            SHIFT_VALUES[swap.typeSwap as keyof typeof SHIFT_VALUES];

          const isChecked = swap.isAcceptedAdmin;
          const isRefused = swap.isAcceptedEmployee2;

          const isOwner =
            idUser !== undefined &&
            swap.idEmployee !== undefined &&
            swap.idEmployee === idUser;

          return (
            <TableRow
              key={`swap-${swap.id}`}
              className={cn(
                "[&>td]:p-1 [&>td]:py-3 [&>td]:text-xs",
                isChecked && "[&>td]:text-green-600!",
                isRefused && "line-through opacity-60",
              )}
            >
              <TableCell className="text-red-600 w-8">
                <Trash2Icon
                  size={14}
                  strokeWidth={1.5}
                  // onClick={async () => {
                  //   if (isOwner) {
                  //     await updateRefuseStatus(
                  //       `${swap.year}-${swap.month}`,
                  //       swap.id,
                  //       true,
                  //     );
                  //     toast.success("Заявка отклонена");
                  //   } else {
                  //     toast.error("Вы не можете отклонить заявку");
                  //   }
                  // }}
                />
              </TableCell>
              <TableCell className="text-blue-500">
                {swap.dateRegister}
              </TableCell>
              <TableCell>
                {swap.employee.split(" ")[0]}{" "}
                {swap.employee.split(" ")[1]?.[0] || ""}
              </TableCell>
              <TableCell>
                {IconComponent ? (
                  <IconComponent className="h-3 w-3 text-red-500" />
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <span>
                  {swap.employee2.split(" ")[0]}{" "}
                  {swap.employee2.split(" ")[1]?.[0] || ""}
                </span>
              </TableCell>
              <TableCell className="text-yellow-700">
                {swap.date ? format(new Date(swap.date), "dd.MM") : "-"}
              </TableCell>
              <TableCell className="text-bl font-bold w-8 text-center">
                {swap.shift}
              </TableCell>
              <TableCell className="w-10 text-center pr-4">
                <Checkbox
                  checked={swap.isAcceptedAdmin ?? false}
                  onCheckedChange={async (checked) => {
                    const value = checked === true;

                    isAdmin && ""
                      // (await updateSwapStatus(
                      //   `${swap.year}-${swap.month}`,
                      //   swap.id,
                      //   value,
                      // ));
                  }}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
