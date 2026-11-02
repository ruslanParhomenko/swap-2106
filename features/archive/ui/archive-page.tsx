"use client";

import { Fragment, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { format, parse } from "date-fns";
import { useSession } from "next-auth/react";
import { GetSwapData } from "../actions/get-swaps";
import ArchiveSwapRow from "./archive-swap-row";
import { ROLE_ADMIN } from "@/constants/role";

export function ArchivePage({ swapsList }: { swapsList: GetSwapData[] }) {
  console.log("ArchivePage", swapsList);
  const [collapsed, setCollapsed] = useState<string[]>([]);

  const { data: session } = useSession();
  const roleUser = session?.user?.role;
  const idUser = session?.user?.id!;

  const isAdmin = roleUser === ROLE_ADMIN;
  const sortedList = [...swapsList].sort((a, b) => b.id.localeCompare(a.id));

  if (swapsList.length === 0) {
    return (
      <div className="flex justify-center items-center text-muted-foreground">
        No swaps found
      </div>
    );
  }

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
                className="cursor-pointer border-0 [&>td]:py-2"
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
                  className="text-xs font-bold text-gray-600 text-center"
                >
                  {format(new Date(`${doc.id}-01`), "LLLL")}
                  <span className="ml-2 font-normal text-muted-foreground">
                    : {doc.data.length}
                  </span>
                </TableCell>
              </TableRow>

              {!isCollapsed &&
                sortedData.map((swap) => {
                  return (
                    <ArchiveSwapRow
                      key={swap.id}
                      docId={doc.id.split("-").slice(0, 2).join("-")}
                      swap={swap}
                      isAdmin={isAdmin}
                      idUser={idUser}
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
