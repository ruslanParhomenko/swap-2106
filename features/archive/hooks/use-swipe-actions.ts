import { useState } from "react";
import { toast } from "sonner";
import { updateEmployeeAcceptance } from "../actions/update-swap-accept";
import { updateSwapStatusAdmin } from "../actions/update-swap-admin";
import { formatDateTime } from "@/utils/get-formatted-date";

export function useSwapActions(docId: string, swapId: string) {
  const [pending, setPending] = useState(false);

  const run = async (
    action: () => Promise<unknown>,
    ok: string,
    fail: string,
  ) => {
    setPending(true);
    try {
      await action();
      toast.success(ok);
    } catch {
      toast.error(fail);
    } finally {
      setPending(false);
    }
  };

  const acceptByEmployee = () =>
    run(
      async () => {
        const dateAcceptedEmployee2 = formatDateTime(new Date());
        const res = await updateEmployeeAcceptance(
          docId,
          swapId,
          dateAcceptedEmployee2,
        );
        if (res?.error) throw new Error("Failed to accept swap");
      },
      "swap accepted",
      "Failed to accept swap",
    );

  const acceptByAdmin = () =>
    run(
      async () => {
        const dateAcceptedAdmin = formatDateTime(new Date());
        const res = await updateSwapStatusAdmin(
          docId,
          swapId,
          true,
          dateAcceptedAdmin,
        );
        if (res?.error) throw new Error("Failed to accept swap by admin");
      },
      "swap accepted by admin",
      "Failed to accept swap by admin",
    );

  return { pending, acceptByEmployee, acceptByAdmin };
}
