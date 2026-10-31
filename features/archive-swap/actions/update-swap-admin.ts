"use server";
import { db } from "@/lib/firebase";
// ваш путь
import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";    // ваш конфиг

export async function updateSwapStatusAdmin(
  docId: string,
  swapId: string,
  value: boolean,
) {
  // Проверка админа на сервере: клиентскому isAdmin доверять нельзя
  const session = await getServerSession(/* authOptions */);
  if (!session?.user?.email || session.user.email !== process.env.USER_EMAIL) {
    return { error: "forbidden" };
  }

  try {
    const ref = db.collection("swaps").doc(docId); // имя коллекции ваше

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) throw new Error("not found");

      const list = (snap.data()?.data ?? []) as Array<{ id: string }>;
      const next = list.map((s) =>
        s.id === swapId ? { ...s, isAcceptedAdmin: value } : s,
      );

      tx.update(ref, { data: next });
    });

    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "failed" };
  }
}
