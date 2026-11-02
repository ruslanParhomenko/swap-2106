import { z } from "zod";

export const swapSchema = z.object({
  employee: z.string().min(1, "Обязательное поле"),
  idEmployee: z.string().min(1, "Обязательное поле"),
  employee2: z.string(),
  idEmployee2: z.string(),
  role: z.string(),
  typeSwap: z.string(),
  date: z.string().min(1, "Обязательное поле"),
  dateRegister: z.string(),
  dateAcceptedEmployee2: z.string(),
  dateAcceptedAdmin: z.string(),
  newShiftEmployee: z.string().min(1, "Обязательное поле"),
  newShiftEmployee2: z.string(),
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
  dateAcceptedEmployee2: "",
  dateAcceptedAdmin: "",
  newShiftEmployee: "",
  newShiftEmployee2: "",
  isAcceptedEmployee2: false,
  isAcceptedAdmin: false,
};
