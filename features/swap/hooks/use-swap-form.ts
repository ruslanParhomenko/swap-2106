"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  swapDefaultValues,
  type SwapFormData,
  swapSchema,
} from "../model/schema";
import { zodResolver } from "@hookform/resolvers/zod";
export default function useSwapForm() {
  const form = useForm<SwapFormData>({
    resolver: zodResolver(swapSchema),
    defaultValues: swapDefaultValues,
  });

  const errors = form.formState.errors;
  const onSubmit: SubmitHandler<SwapFormData> = (data) => {
    console.log(data);
  };
  return {
    form,
    onSubmit,
    errors,
  };
}
