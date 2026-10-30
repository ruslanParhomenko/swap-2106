"use server"

import { SWAP_ACTION_TAG } from "@/constants/actions-tags";
import { SwapFormData } from "../model/schema";
import { db } from "@/lib/firebase";
import { updateTag } from "next/cache";



const actionTag = SWAP_ACTION_TAG;

export async function createSwap({data}:{data:SwapFormData}) {
const {date} = data;
 

  const docRef = db.collection(actionTag).doc("main");

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(docRef);
    if (!snap.exists) {
      tx.set(docRef, { data: [data] });
      return;
    }
    const raw = snap.data();
    tx.update(docRef, {
      data: [...(raw?.data ?? []), data],
    });
  });

  updateTag(actionTag);

  return { message: "Swap успешно создан!", error: false };
}