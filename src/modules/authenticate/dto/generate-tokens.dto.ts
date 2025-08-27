import { z } from 'zod';

export const generateTokensDtoServiceSchema = z.object({
  accountId: z.string().uuid(),
});

export type TGenerateTokensDtoServiceSchema = z.infer<
  typeof generateTokensDtoServiceSchema
>;
