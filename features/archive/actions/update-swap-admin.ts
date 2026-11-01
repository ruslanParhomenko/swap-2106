"use server";
import { SWAP_ACTION_TAG } from "@/constants/actions-tags";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { getServerSession } from "next-auth";
import { updateTag } from "next/cache";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function updateSwapStatusAdmin(
  docId: string,
  swapId: string,
  value: boolean,
) {
  const session = await getServerSession(authOptions);
  console.log("props", docId, swapId, value);
  console.log("ADMIN_EMAIL", ADMIN_EMAIL);
  console.log("session", session?.user?.email, ADMIN_EMAIL);
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return { error: "forbidden" };
  }

  try {
    const ref = db.collection(SWAP_ACTION_TAG).doc(docId);

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) throw new Error("not found");

      const list = (snap.data()?.data ?? []) as Array<{ id: string }>;
      const next = list.map((s) =>
        s.id === swapId ? { ...s, isAcceptedAdmin: value } : s,
      );

      tx.update(ref, { data: next });
    });

    updateTag(SWAP_ACTION_TAG);

    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "failed" };
  }
}
