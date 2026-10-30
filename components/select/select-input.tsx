"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

export type SelectOption = {
  value: string;
  label: string;
};

type Props = {
  fieldName: string;
  fieldLabel?: string;
  placeHolder?: string;
  data: SelectOption[];
  disabled?: boolean;
  className?: string;
  orientation?: "vertical" | "horizontal";
  onChange?: (option: SelectOption | null) => void;
  withOutBorder?: boolean;
};

export default function SelectInput({
  fieldName,
  fieldLabel,
  placeHolder,
  data,
  disabled,
  className,
  orientation = "vertical",
  onChange,
  withOutBorder = false,
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field, fieldState }) => {
        const isDisabled = disabled || field.disabled;
        const selected = data.find((item) => item.value === field.value);

       const setValue = (value: string | null) => {
  field.onChange(value);

  const selectedOption =
    data.find((item) => item.value === value) ?? null;

  onChange?.(selectedOption);
};


        return (
          <Field data-invalid={fieldState.invalid} orientation={orientation}>
            {fieldLabel && (
              <FieldLabel htmlFor={field.name}>{fieldLabel}</FieldLabel>
            )}

            <div className="relative w-full">
              <Select
                name={field.name}
                value={field.value ?? null}
                onValueChange={(value) => setValue(value)}
                disabled={isDisabled}
              >
                <SelectTrigger
                  id={fieldName}
                  aria-invalid={fieldState.invalid}
                  onBlur={field.onBlur}
                  className={cn(
                    className,
                    "w-full [&>svg]:hidden h-12! bg-border flex items-center justify-start",
                    field.value && "pr-2 text-white justify-center bg-blue-500",
                    !field.value && "text-muted-foreground",
                    field.value &&
                      withOutBorder &&
                      "border-transparent shadow-none text-green-600 pl-2",
                  )}
                >
                  <SelectValue placeholder={placeHolder}>
                    {selected?.label ?? placeHolder}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent side="bottom" avoidCollisions={false} position="item-aligned"  className="w-full p-2 [&>svg]:hidden">
                  {data.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      className={cn(
                        field.value === item.value &&
                          "text-white",
                      )}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {field.value && !isDisabled && !withOutBorder && (
                <button
                  type="button"
                  aria-label="reset"
                  onClick={() => setValue(null)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-1 text-white hover:text-foreground"
                >
                  <Trash2 className="size-3.5" strokeWidth={1.5} />
                </button>
              )}
            </div>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
