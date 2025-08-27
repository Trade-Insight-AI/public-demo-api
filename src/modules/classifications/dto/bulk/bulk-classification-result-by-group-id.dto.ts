import { z } from 'zod';

export const bulkClassificationResultByGroupIdDtoParamSchema = z.object({
  groupId: z.string().min(1, 'Group ID is required'),
});

export const bulkClassificationResultByGroupIdDtoServiceSchema =
  bulkClassificationResultByGroupIdDtoParamSchema;

export type TBulkClassificationResultByGroupIdDtoParamSchema = z.infer<
  typeof bulkClassificationResultByGroupIdDtoParamSchema
>;

export type TBulkClassificationResultByGroupIdDtoServiceSchema = z.infer<
  typeof bulkClassificationResultByGroupIdDtoServiceSchema
>;
