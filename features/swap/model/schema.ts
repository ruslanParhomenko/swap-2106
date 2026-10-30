import { z } from "zod";

export const swapSchema = z.object({
  employee: z.string(),
  idEmployee: z.string(),
  employee2: z.string(),
  idEmployee2: z.string(),
  role: z.string(),
  typeSwap: z.enum(["swap", "take", ""]),
  date: z.string(),
  dateRegister: z.string(),
  year: z.string(),
  month: z.string(),
  shift: z.string(),
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
  year: "",
  month: "",
  shift: "",
  isAcceptedEmployee2: false,
  isAcceptedAdmin: false,
};
