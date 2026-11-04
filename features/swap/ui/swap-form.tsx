"use client";
import { useEffect, useEffectEvent, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useSession } from "next-auth/react";
import DateInput from "@/components/date-input/date-input";
import SelectInput from "@/components/select/select-input";
import { Button } from "@/components/ui/button";
import { NOT_WORKING_SHIFTS, SHIFT_ACTIONS } from "../model/constants";
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
  const employee1Name = useWatch({ control, name: "employee" });
  const employee2Name = useWatch({ control, name: "employee2" });

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

  const cellEmployee2 =
    selectedEmployee2 && day
      ? (scheduleByMonth.find((r) => r.employeeId === selectedEmployee2)
          ?.shifts[day - 1] ?? "")
      : "";

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

  const employees = useMemo(() => {
    if (!day) return [];

    const map = new Map<string, { value: string; label: string }>();
    for (const row of scheduleByMonth) {
      if (row.employeeId === userId) continue;

      const cell = row.shifts[day - 1];
      if (!cell || NOT_WORKING_SHIFTS.includes(cell)) continue;

      map.set(row.employeeId, { value: row.employeeId, label: row.employee });
    }
    return [...map.values()];
  }, [scheduleByMonth, userId, day]);

  const syncTypeSwap = useEffectEvent((next: string) => {
    if (getValues("typeSwap") === next) return;
    setValue("typeSwap", next, { shouldValidate: true });
  });

  const syncShifts = useEffectEvent(() => {
    const opts = { shouldValidate: true };
    setValue("newShiftEmployee", cellEmployee2 ?? "", opts);
    setValue(
      "newShiftEmployee2",
      typeSwap === SHIFT_ACTIONS[0].value ? myCell : "",
      opts,
    );
  });

  useEffect(() => {
    syncTypeSwap(typeSwap);
  }, [typeSwap]);

  useEffect(() => {
    if (!selectedEmployee2) return;
    syncShifts();
  }, [selectedEmployee2, cellEmployee2, myCell, typeSwap]);

  useEffect(() => {
    if (!selectedEmployee2) return;

    const stillAvailable = employees.some((e) => e.value === selectedEmployee2);
    if (hasDate && stillAvailable) return;

    setValue("idEmployee2", "", { shouldValidate: true });
    setValue("employee2", "");
    setValue("newShiftEmployee", "");
    setValue("newShiftEmployee2", "");
  }, [hasDate, employees, selectedEmployee2, setValue]);

  const dateLabel = hasDate ? parsedDate!.toLocaleDateString("ru-RU") : "";

  return (
    <div className="flex flex-col gap-10 w-full md:w-[50dvw]  px-2  md:px-0">
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
        disabled={employees.length === 0 || !day || !selectedTypeSwap}
        onChange={(value) => {
          setValue("employee2", value?.label || "");
        }}
      />

      {selectedEmployee2 && cellEmployee2 && (
        <div className="flex flex-col gap-1 text-sm">
          <span className="text-xs text-red-500 text-center my-1">
            {dateLabel}
          </span>
          <div className="flex items-center justify-around">
            <span className="text-blue-600">
              {employee1Name} = <b>{cellEmployee2}</b>
            </span>

            <span className="text-green-600">
              {employee2Name} = <b>{myCell || "выходной"}</b>
            </span>
          </div>
        </div>
      )}

      <div className="my-4 flex justify-end">
        <Button
          type="submit"
          variant="secondary"
          disabled={!isValid}
          className={`py-2 h-11 px-4 rounded-md transition-colors w-32 ${
            !isValid
              ? "bg-gray-200 cursor-not-allowed"
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
