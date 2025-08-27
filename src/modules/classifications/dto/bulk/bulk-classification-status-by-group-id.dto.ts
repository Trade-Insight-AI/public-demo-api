import { z } from 'zod';

export const bulkClassificationStatusByGroupIdDtoParamSchema = z.object({
  groupId: z.string().min(1, 'Group ID is required'),
});

export const bulkClassificationStatusByGroupIdDtoServiceSchema =
  bulkClassificationStatusByGroupIdDtoParamSchema;

export type TBulkClassificationStatusByGroupIdDtoParamSchema = z.infer<
  typeof bulkClassificationStatusByGroupIdDtoParamSchema
>;

export type TBulkClassificationStatusByGroupIdDtoServiceSchema = z.infer<
  typeof bulkClassificationStatusByGroupIdDtoServiceSchema
>;
