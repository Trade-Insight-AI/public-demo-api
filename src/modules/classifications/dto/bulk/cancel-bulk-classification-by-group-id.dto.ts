import { z } from 'zod';

export const cancelBulkClassificationByGroupIdDtoParamSchema = z.object({
  groupId: z.string().min(1, 'Group ID is required'),
});

export const cancelBulkClassificationByGroupIdDtoServiceSchema =
  cancelBulkClassificationByGroupIdDtoParamSchema;

export type TCancelBulkClassificationByGroupIdDtoParamSchema = z.infer<
  typeof cancelBulkClassificationByGroupIdDtoParamSchema
>;

export type TCancelBulkClassificationByGroupIdDtoServiceSchema = z.infer<
  typeof cancelBulkClassificationByGroupIdDtoServiceSchema
>;
