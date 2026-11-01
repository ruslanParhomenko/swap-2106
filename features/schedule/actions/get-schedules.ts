"use server";

import { SCHEDULE_ACTION_TAG } from "@/constants/actions-tags";
import { db } from "@/lib/firebase";
import { cacheLife, cacheTag } from "next/cache";
import { rowShiftsType, ScheduleData } from "../model/type";
import { MONTHS } from "@/utils/get-month-days";

const actionTag = SCHEDULE_ACTION_TAG;

interface Props {
  year: string;
  month: string;
  roleKey: string;
}

type RowShifts = ScheduleData["rowShifts"];

export interface SchedulesResult {
  current: { rowShifts: RowShifts; month: string };
  next: { rowShifts: RowShifts; month: string };
}
function getNextPeriod(year: string, month: string) {
  const idx = MONTHS.indexOf(month.toLowerCase());
  if (idx === -1) throw new Error(`Invalid month: ${month}`);

  return {
    year: String(idx === 11 ? Number(year) + 1 : Number(year)),
    month: MONTHS[(idx + 1) % 12],
  };
}

async function fetchSchedule(
  year: string,
  month: string,
  roleKey: string,
): Promise<RowShifts> {
  const snap = await db
    .collection(actionTag)
    .doc(year)
    .collection("months")
    .doc(month)
    .collection("role")
    .doc(roleKey)
    .get();

  if (!snap.exists) return [];

  const data = snap.data() as { rowShifts?: rowShiftsType[] } | undefined;
  return data?.rowShifts ?? [];
}

export async function getSchedulesActual({
  year,
  month,
  roleKey,
}: Props): Promise<SchedulesResult> {
  "use cache";

  cacheLife("max");
  cacheTag(actionTag);

  const next = getNextPeriod(year, month);

  const [current, nextSchedule] = await Promise.all([
    fetchSchedule(year, month, roleKey),
    fetchSchedule(next.year, next.month, roleKey),
  ]);

  return {
    current: { rowShifts: current, month: month },
    next: { rowShifts: nextSchedule, month: next.month },
  };
}
