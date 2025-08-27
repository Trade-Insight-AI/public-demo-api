import { z } from 'zod';

export const loginDtoBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginDtoServiceSchema = loginDtoBodySchema;

export type TLoginDtoBodySchema = z.infer<typeof loginDtoBodySchema>;

export type TLoginDtoServiceSchema = z.infer<typeof loginDtoServiceSchema>;
