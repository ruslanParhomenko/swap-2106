"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  swapDefaultValues,
  type SwapFormData,
  swapSchema,
} from "../model/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDateTime } from "@/utils/get-formatted-date";
import { toast } from "sonner";
import { createSwap } from "../actions/create-swap";
import { useSession } from "next-auth/react";

export default function useSwapForm() {
  const { data: session } = useSession();

  const form = useForm<SwapFormData>({
    resolver: zodResolver(swapSchema),
    values: {
      ...swapDefaultValues,
      employee: session?.user?.name || "",
      idEmployee: session?.user?.id || "",
      role: session?.user?.role || "",
    },
  });

  const errors = form.formState.errors;
  const onSubmit: SubmitHandler<SwapFormData> = async (data) => {
    const currentDateTime = formatDateTime(new Date());

    const formattedData = {
      ...data,
      dateRegister: currentDateTime,
    };

    console.log(formattedData);

    await createSwap({
      data: formattedData,
    });

    form.reset();
    toast.success("Заявка отправлена");
  };
  return {
    form,
    onSubmit,
    errors,
  };
}
