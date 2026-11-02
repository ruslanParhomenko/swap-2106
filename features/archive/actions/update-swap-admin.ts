"use server";
import { SCHEDULE_ACTION_TAG, SWAP_ACTION_TAG } from "@/constants/actions-tags";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { MONTHS } from "@/utils/get-month-days";
import { getServerSession } from "next-auth";
import { updateTag } from "next/cache";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function updateSwapStatusAdmin(
  docId: string,
  swapId: string,
  value: boolean,
  dateAcceptedAdmin: string,
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return { error: "forbidden" };
  }

  try {
    const ref = db.collection(SWAP_ACTION_TAG).doc(docId);

    const year = docId.split("-")[0];
    const month = MONTHS[Number(docId.split("-")[1]) - 1];

    const refSchedule = db
      .collection(SCHEDULE_ACTION_TAG)
      .doc(year)
      .collection("months")
      .doc(month)
      .collection("role")
      .doc("bar");

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) throw new Error("not found");

      const list = (snap.data()?.data ?? []) as Array<{ id: string }>;
      const next = list.map((s) =>
        s.id === swapId
          ? { ...s, isAcceptedAdmin: value, dateAcceptedAdmin }
          : s,
      );

      console.log(
        "list",
        list.find((s) => s.id === swapId),
      );

      // tx.update(ref, { data: next });

      const scheduleSnap = await tx.get(refSchedule);
      if (!scheduleSnap.exists) throw new Error("not found");

      const scheduleData = scheduleSnap.data() as { rowShifts?: any[] };
      const nextSchedule = scheduleData.rowShifts?.map((row) =>
        row.id === swapId
          ? { ...row, isAcceptedAdmin: value, dateAcceptedAdmin }
          : row,
      );

      // tx.update(refSchedule, { rowShifts: nextSchedule });
    });

    // updateTag(SWAP_ACTION_TAG);

    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "failed" };
  }
}
