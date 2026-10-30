"use server"

import { db } from "@/lib/firebase";
import { SWAP_ACTION_TAG } from "@/constants/actions-tags";
import { cacheLife, cacheTag } from "next/cache";



const actionTag = SWAP_ACTION_TAG

export async function getSwaps() {

    "use cache"

    cacheLife("max")
    cacheTag(actionTag)
  const doc = await db.collection(actionTag).doc("main").get();

  if (!doc.exists) return [];

  const data = doc.data()?.data ?? [];

  return data;
}

