"use server";

import { db } from "@/lib/firebase";
import { SWAP_ACTION_TAG } from "@/constants/actions-tags";
import { cacheLife, cacheTag } from "next/cache";
import { SwapFormData } from "@/features/swap/model/schema";

const actionTag = SWAP_ACTION_TAG;

type SwapData = SwapFormData & { id: string };
export type GetSwapData = {
  id: string;
  data: SwapData[];
};

export async function getSwaps(): Promise<GetSwapData[]> {
  "use cache";

  cacheLife("max");
  cacheTag(actionTag);

  const snapshot = await db.collection(actionTag).get();

  if (snapshot.empty) return [];

  return snapshot.docs.map((doc) => ({
    id: doc.id as string,
    data: doc.data().data as SwapData[],
  }));
}
