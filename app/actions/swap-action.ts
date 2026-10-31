"use server";

import { SwapFormData } from "@/features/swap/model/schema";
import { db } from "@/lib/firebase";
import admin from "firebase-admin";
import { unstable_cache, updateTag } from "next/cache";

export type SwapActionType = SwapFormData & {
  id: string;
};

const SWAP_ACTION_TAG = "swap_actions";

//delete

export async function deleteSwap(uniqueKey: string, id: string) {
  const docRef = db.collection(SWAP_ACTION_TAG).doc(uniqueKey);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(docRef);
    if (!snap.exists) return;

    const raw = snap.data();
    const list = raw?.data ?? [];

    const filtered = list.filter((item: any) => item.id !== id);

    tx.update(docRef, { data: filtered });
  });

  updateTag(SWAP_ACTION_TAG);
}

//update

export async function updateSwapStatusAdmin(
  uniqueKey: string,
  id: string,
  isAccepted: boolean,
) {
  const docRef = db.collection(SWAP_ACTION_TAG).doc(uniqueKey);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(docRef);
    if (!snap.exists) return;

    const raw = snap.data();
    const list = raw?.data ?? [];

    const updated = list.map((item: any) =>
      item.id === id ? { ...item, isAccepted } : item,
    );

    tx.update(docRef, { data: updated });
  });

  updateTag(SWAP_ACTION_TAG);
}

export async function updateRefuseStatus(
  uniqueKey: string,
  id: string,
  isRefused: boolean,
) {
  const docRef = db.collection(SWAP_ACTION_TAG).doc(uniqueKey);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(docRef);
    if (!snap.exists) return;

    const raw = snap.data();
    const list = raw?.data ?? [];

    const updated = list.map((item: any) =>
      item.id === id ? { ...item, isRefused } : item,
    );

    tx.update(docRef, { data: updated });
  });

  updateTag(SWAP_ACTION_TAG);
}
