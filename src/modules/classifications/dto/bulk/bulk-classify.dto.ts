import {
  TIAProviderBulkClassificationPriorityEnum,
  TIAProviderMockDelayEnum,
} from '@/@shared/providers/tia-provider/models/tia-provider.enums';
import { z } from 'zod';

const stringToBoolean = z.union([
  z.string().transform((value) => value === 'true' || value === '1'),
  z.boolean().default(false),
]);

export const bulkClassifyDtoBodySchema = z.object({
  engine: z.string().min(1, 'Engine is required'),
  priority: z.nativeEnum(TIAProviderBulkClassificationPriorityEnum),
  forceReprocess: stringToBoolean,

  requestId: z.string().uuid().optional(),
  description: z.string().optional(),

  testMode: stringToBoolean.optional(),
  mockDelay: z
    .union([
      z.nativeEnum(TIAProviderMockDelayEnum),
      z.number().int().min(1, 'Custom delay must be at least 1 second'),
    ])
    .optional(),
});

export const bulkClassifyDtoServiceSchema = bulkClassifyDtoBodySchema.extend({
  file: z.object({
    buffer: z.instanceof(Buffer),
    originalname: z.string(),
    mimetype: z.string(),
    size: z.coerce.number().int().positive(),
  }),
});

export type TBulkClassifyDtoBodySchema = z.infer<
  typeof bulkClassifyDtoBodySchema
>;

export type TBulkClassifyDtoServiceSchema = z.infer<
  typeof bulkClassifyDtoServiceSchema
>;
