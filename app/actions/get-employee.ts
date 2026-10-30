"use server";

import { EMPLOYEES_ACTION_TAG } from "@/constants/actions-tags";
import { db } from "@/lib/firebase";
import { redis } from "@/lib/redis";
import { cacheLife, cacheTag } from "next/cache";

const actionTag = EMPLOYEES_ACTION_TAG;

const RESTAURANT_EMPLOYEES = ["waiters", "barmen"] as const;

export type GetEmployees = {
  id: string;
  name: string;
  role: string;
  mail: string;
  status: "active" | "fired";
};

export async function getEmployees(): Promise<GetEmployees[]> {
  "use cache";

  cacheLife("max");
  cacheTag(actionTag);

  const cached = await redis.get<GetEmployees[]>(actionTag);

  if (cached) {
    return cached.filter(
      (employee) =>
        employee.status === "active" &&
        RESTAURANT_EMPLOYEES.includes(
          employee.role as (typeof RESTAURANT_EMPLOYEES)[number],
        ),
    );
  }

  const snapshot = await db.collection("employees").get();

  const employees = snapshot.docs
    .map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data.name,
        role: data.role,
        mail: data.mail,
        status: data.status,
      };
    })
    .filter(
      (employee) =>
        employee.status === "active" &&
        RESTAURANT_EMPLOYEES.includes(
          employee.role as (typeof RESTAURANT_EMPLOYEES)[number],
        ),
    );

  return employees;
}
