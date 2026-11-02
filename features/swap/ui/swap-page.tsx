"use client";
import FormWrapper from "@/components/wrapper/form-wrapper";
import useSwapForm from "../hooks/use-swap-form";
import SwapForm from "./swap-form";
import { SchedulesResult } from "@/features/schedule/actions/get-schedules";

export function SwapPage({ schedules }: { schedules: SchedulesResult }) {
  const { form, onSubmit } = useSwapForm();

  const value = form.watch();

  console.log("form values:", value);

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <SwapForm schedules={schedules} />
    </FormWrapper>
  );
}
