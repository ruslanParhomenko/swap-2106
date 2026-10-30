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

  const value = form.watch();

  const {
  isValid,
  isSubmitting,
} = form.formState;


  console.log("value", value);

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
        fieldName="idEmployee2"
        placeHolder={selectedEmployee.length > 0 ? "Выбрать сотрудника" : ""}
        data={selectedEmployee}
        className="w-full"
        disabled={selectedEmployee.length === 0}
        onChange={(value) => {
          form.setValue("employee2", value?.label || "");
        }}
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
