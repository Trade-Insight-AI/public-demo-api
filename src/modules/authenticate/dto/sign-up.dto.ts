import { z } from 'zod';

export const signUpDtoBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signUpDtoServiceSchema = signUpDtoBodySchema;

export type TSignUpDtoBodySchema = z.infer<typeof signUpDtoBodySchema>;

export type TSignUpDtoServiceSchema = z.infer<typeof signUpDtoServiceSchema>;
