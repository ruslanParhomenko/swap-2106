"use client";
import FormWrapper from "@/components/wrapper/form-wrapper";
import useSwapForm from "../hooks/use-swap-form";
import SwapForm from "./swap-form";
import { SchedulesResult } from "@/features/schedule/actions/get-schedules";
import { useWatch } from "react-hook-form";
import { MONTHS } from "@/utils/get-month-days";
import { rowShiftsType } from "@/features/schedule/model/type";
import type { Session } from "next-auth";

export function SwapPage({
  employees,
  schedules,
  session,
}: {
  employees: { id: string; name: string; role: string; mail: string }[];
  schedules: SchedulesResult;
  session: Session;
}) {

  const { form, onSubmit } = useSwapForm(session);
  const selectedMonth = useWatch({
    control: form.control,
    name: "date",
  });

  const scheduleByMonth: rowShiftsType[] =
    Object.entries(schedules)
      .flatMap(([_, value]) => value)
      .find(
        (shift) => shift.month === MONTHS[new Date(selectedMonth).getMonth()],
      )?.rowShifts || [];

  const selectedEmployee = [
    ...new Set(
      scheduleByMonth.filter((shift) => shift.employeeId !== session.user.id).map((shift) => {
        return {
          value: shift.employeeId,
          label: shift.employee,
        };
      }),
    ),
  ];


  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <SwapForm selectedEmployee={selectedEmployee} />
    </FormWrapper>
  );
}
