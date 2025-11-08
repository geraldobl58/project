import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, {
    message: "Campo obrigatório com no mínimo 2 caracteres",
  }),
  email: z.string().email().min(2, {
    message: "Campo obrigatório com no mínimo 2 caracteres",
  }),
  username: z.string().min(2, {
    message: "Campo obrigatório com no mínimo 2 caracteres",
  }),
  phone: z
    .string()
    .min(10, {
      message: "Campo obrigatório com no mínimo 10 caracteres",
    })
    .max(15, {
      message: "Campo obrigatório com no máximo 15 caracteres",
    }),
  city: z
    .string()
    .min(2, {
      message: "Campo obrigatório com no mínimo 2 caracteres",
    })
    .max(100, {
      message: "Campo obrigatório com no máximo 100 caracteres",
    }),
});

export type UserFormData = z.infer<typeof userSchema>;
