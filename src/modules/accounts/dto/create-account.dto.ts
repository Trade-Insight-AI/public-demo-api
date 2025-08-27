import { z } from 'zod';

export const createAccountDtoServiceSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type TCreateAccountDtoServiceSchema = z.infer<
  typeof createAccountDtoServiceSchema
>;
