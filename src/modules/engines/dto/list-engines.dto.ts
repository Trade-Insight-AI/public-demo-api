import { z } from 'zod';

export const listEnginesDtoServiceSchema = z.object({
  tiaAccessToken: z.string().min(1, 'TIA access token is required'),
});

export type TListEnginesDtoServiceSchema = z.infer<
  typeof listEnginesDtoServiceSchema
>;
