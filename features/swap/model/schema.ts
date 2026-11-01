import { z } from "zod";

export const swapSchema = z.object({
  employee: z.string().min(1, "Обязательное поле"),
  idEmployee: z.string().min(1, "Обязательное поле"),
  employee2: z.string().min(1, "Обязательное поле"),
  idEmployee2: z.string().min(1, "Обязательное поле"),
  role: z.string(),
  typeSwap: z.string(),
  date: z.string().min(1, "Обязательное поле"),
  dateRegister: z.string(),
  shift: z.string().min(1, "Обязательное поле"),
  isAcceptedEmployee2: z.boolean(),
  isAcceptedAdmin: z.boolean(),
});

export type SwapFormData = z.infer<typeof swapSchema>;

export const swapDefaultValues: SwapFormData = {
  employee: "",
  idEmployee: "",
  employee2: "",
  idEmployee2: "",
  role: "",
  typeSwap: "",
  date: "",
  dateRegister: "",
  shift: "",
  isAcceptedEmployee2: false,
  isAcceptedAdmin: false,
};
