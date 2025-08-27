import { z } from 'zod';

export const deleteBulkClassificationByGroupIdDtoParamSchema = z.object({
  groupId: z.string().min(1, 'Group ID is required'),
});

export const deleteBulkClassificationByGroupIdDtoServiceSchema =
  deleteBulkClassificationByGroupIdDtoParamSchema;

export type TDeleteBulkClassificationByGroupIdDtoParamSchema = z.infer<
  typeof deleteBulkClassificationByGroupIdDtoParamSchema
>;

export type TDeleteBulkClassificationByGroupIdDtoServiceSchema = z.infer<
  typeof deleteBulkClassificationByGroupIdDtoServiceSchema
>;
