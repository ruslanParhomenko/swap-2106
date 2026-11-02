"use client";

import { format, isValid, parseISO } from "date-fns";
import { CalendarIcon, RotateCcw, Trash2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Props = {
  fieldName: string;
  fieldLabel?: string;
  placeHolder?: string;
  disabled?: boolean;
  className?: string;
  displayFormat?: string;
  onChange?: (value: string | null) => void;
  withOutBorder?: boolean;
  orientation?: "vertical" | "horizontal";
};

export default function DateInput({
  fieldName,
  fieldLabel,
  placeHolder,
  disabled,
  className,
  displayFormat = "dd.MM.yyyy",
  onChange,
  withOutBorder = false,
  orientation = "vertical",
}: Props) {
  const { control } = useFormContext();

  const [open, setOpen] = useState(false);

  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field, fieldState }) => {
        const parsed = field.value ? parseISO(field.value) : undefined;
        const selected = parsed && isValid(parsed) ? parsed : undefined;
        const isDisabled = disabled || field.disabled;

        const setValue = (value: string | null) => {
          field.onChange(value);
          onChange?.(value);
        };

        return (
          <Field data-invalid={fieldState.invalid} orientation={orientation}>
            {fieldLabel && (
              <FieldLabel htmlFor={fieldName}>{fieldLabel}</FieldLabel>
            )}

            <div className="relative w-full">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                  ref={field.ref}
                  id={fieldName}
                  disabled={isDisabled}
                  aria-invalid={fieldState.invalid}
                  onBlur={field.onBlur}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full justify-start font-normal h-13 tracking-wider border-2 bg-border",
                    selected && "text-white bg-blue-500 justify-center",
                    !selected && "text-muted-foreground",
                    selected &&
                      withOutBorder &&
                      "border-transparent pr-6 pl-4 text-green-600 shadow-none",
                    className,
                  )}
                >
                  {!selected && <CalendarIcon className="mr-2 size-4" />}
                  {selected ? format(selected, displayFormat) : placeHolder}
                </PopoverTrigger>

                <PopoverContent className="w-auto p-2" align="center">
                  <Calendar
                    mode="single"
                    selected={selected}
                    defaultMonth={selected}
                    // captionLayout="dropdown"
                    weekStartsOn={1}
                    onSelect={(d) => {
                      setValue(d ? format(d, "yyyy-MM-dd") : null);
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>

              {selected && !isDisabled && (
                <button
                  type="button"
                  aria-label="reset date"
                  onClick={() => setValue(null)}
                  className="text-white hover:text-foreground hover:bg-accent absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 transition-colors"
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
