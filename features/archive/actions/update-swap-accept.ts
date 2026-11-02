"use server";

import { db } from "@/lib/firebase";
import { SWAP_ACTION_TAG } from "@/constants/actions-tags";
import { updateTag } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function updateEmployeeAcceptance(
  uniqueKey: string,
  id: string,
  dateAcceptedEmployee2: string,
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) return { error: true };

  const docRef = db.collection(SWAP_ACTION_TAG).doc(uniqueKey);

  const updated = await db.runTransaction(async (tx) => {
    const snap = await tx.get(docRef);

    if (!snap.exists) return false;

    const list = snap.data()?.data ?? [];
    const item = list.find((item: any) => item.id === id);

    if (!item || item.idEmployee2 !== userId) return false;
    if (item.isAcceptedEmployee2) return false;

    const newList = list.map((item: any) =>
      item.id === id
        ? { ...item, isAcceptedEmployee2: true, dateAcceptedEmployee2 }
        : item,
    );

    tx.update(docRef, { data: newList });

    return true;
  });

  if (!updated) return { error: true };

  updateTag(SWAP_ACTION_TAG);

  return { error: false };
}
