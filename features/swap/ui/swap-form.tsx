"use client";
import { useEffect, useEffectEvent, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useSession } from "next-auth/react";
import DateInput from "@/components/date-input/date-input";
import SelectInput from "@/components/select/select-input";
import { Button } from "@/components/ui/button";
import {
  NOT_WORKING_SHIFTS,
  SHIFT_ACTIONS,
  SHIFTS_VALUES,
} from "../model/constants";
import { SchedulesResult } from "@/features/schedule/actions/get-schedules";
import { rowShiftsType } from "@/features/schedule/model/type";
import { MONTHS } from "@/utils/get-month-days";

export default function SwapForm({
  schedules,
}: {
  schedules: SchedulesResult;
}) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { control, setValue, getValues, formState } = useFormContext();
  const { isValid, isSubmitting } = formState;

  const selectedDate = useWatch({ control, name: "date" });
  const selectedTypeSwap = useWatch({ control, name: "typeSwap" });
  const selectedEmployee2 = useWatch({ control, name: "idEmployee2" });

  const parsedDate = selectedDate ? new Date(selectedDate) : null;
  const hasDate = !!parsedDate && !isNaN(parsedDate.getTime());
  const month = hasDate ? MONTHS[parsedDate.getMonth()] : null;
  const day = hasDate ? parsedDate.getDate() : null;

  const scheduleByMonth: rowShiftsType[] = useMemo(
    () =>
      month
        ? Object.values(schedules)
            .flat()
            .find((s) => s.month === month)?.rowShifts || []
        : [],
    [schedules, month],
  );

  const cellEmployee2 = selectedEmployee2
    ? scheduleByMonth.find((r) => r.employeeId === selectedEmployee2)?.shifts[
        day! - 1
      ]
    : "";

  console.log("cellEmployee2", cellEmployee2);

  const myCell: string =
    day && userId
      ? (scheduleByMonth.find((r) => r.employeeId === userId)?.shifts[
          day - 1
        ] ?? "")
      : "";

  const typeSwap = !hasDate
    ? ""
    : NOT_WORKING_SHIFTS.includes(myCell)
      ? ""
      : myCell
        ? SHIFT_ACTIONS[0].value
        : SHIFT_ACTIONS[1].value;

  const syncTypeSwap = useEffectEvent((next: string) => {
    if (getValues("typeSwap") === next) return;
    setValue("typeSwap", next, { shouldValidate: true });
  });

  useEffect(() => {
    syncTypeSwap(typeSwap);
  }, [typeSwap]);

  // уникальные сотрудники, кроме текущего
  const employees = useMemo(() => {
    const map = new Map<string, { value: string; label: string }>();
    for (const row of scheduleByMonth) {
      if (row.employeeId === userId) continue;
      map.set(row.employeeId, { value: row.employeeId, label: row.employee });
    }
    return [...map.values()];
  }, [scheduleByMonth, userId]);

  return (
    <div className="flex flex-col gap-8 w-full md:w-120 px-2 mt-12 md:px-0">
      <DateInput
        fieldName="date"
        placeHolder="Выберите дату"
        className="w-full"
      />
      <SelectInput
        fieldName="typeSwap"
        placeHolder="Выберите тип обмена"
        data={SHIFT_ACTIONS}
        disabled
      />
      <SelectInput
        fieldName="idEmployee2"
        placeHolder={employees.length > 0 ? "Выбрать сотрудника" : ""}
        data={employees}
        className="w-full"
        disabled={employees.length === 0}
        onChange={(value) => {
          setValue("employee2", value?.label || "");
        }}
      />
      <SelectInput
        fieldName="shift"
        placeHolder="Выберите смену"
        data={SHIFTS_VALUES}
      />
      <div className="text-xs text-gray-600 flex items-center justify-center gap-2">
        {selectedTypeSwap && (
          <span>
            {selectedTypeSwap}: {selectedEmployee2}
          </span>
        )}
        {cellEmployee2 && <span>Смена сотрудника: {cellEmployee2}</span>}
      </div>

      <div className="my-8 flex justify-end">
        <Button
          type="submit"
          variant="secondary"
          disabled={!isValid}
          className={`py-2 h-12 px-4 rounded-md text-white transition-colors w-32 ${
            !isValid
              ? "bg-gray-400 cursor-not-allowed"
              : "text-blue-600 font-bold"
          }`}
        >
          {!isValid
            ? "Заполните..."
            : isSubmitting
              ? "Отправка..."
              : "Отправить"}
        </Button>
      </div>
    </div>
  );
}
