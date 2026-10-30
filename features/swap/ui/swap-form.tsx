import DateInput from "@/components/date-input/date-input";
import SelectInput from "@/components/select/select-input";
import { Button } from "@/components/ui/button";
import { SHIFT_ACTIONS, SHIFTS_VALUES } from "../model/constants";
import { useFormContext, useWatch } from "react-hook-form";

export default function SwapForm({
  selectedEmployee,
}: {
  selectedEmployee: { value: string; label: string }[];
}) {
  const form = useFormContext();

  const selectedEmployee2 = useWatch({
    control: form.control,
    name: "employee2",
  });
  return (
    <div className="flex flex-col gap-8 w-full md:w-120 px-2 mt-12 md:px-0">
      <DateInput
        fieldName="date"
        placeHolder="Выберите дату"
        className="w-full"
      />
      <SelectInput
        fieldName="shift"
        placeHolder="Выберите смену"
        data={SHIFTS_VALUES}
      />
      <SelectInput
        fieldName="employee2"
        placeHolder={selectedEmployee.length > 0 ? "Выбрать сотрудника" : ""}
        data={selectedEmployee}
        className="w-full"
        disabled={selectedEmployee.length === 0}
      />
      <SelectInput
        fieldName="typeSwap"
        placeHolder="Выберите тип обмена"
        data={SHIFT_ACTIONS}
        disabled={selectedEmployee2 === ""}
      />

      <div className="my-8 flex justify-end">
        <Button
          type="submit"
          variant="default"
          disabled={false}
          className={`py-2 px-4 rounded-md text-white transition-colors md:w-32 ${
            true
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-600"
          }`}
        >
          {true ? "Отправка..." : "Отправить"}
        </Button>
      </div>
    </div>
  );
}
