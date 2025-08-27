import { z } from 'zod';
import { TIAProviderMockDelayEnum } from '@/@shared/providers/tia-provider/models/tia-provider.enums';

export const classifyProductDtoBodySchema = z.object({
  productDescription: z.string().min(1, 'Product description is required'),
  engine: z.string().min(1, 'Engine is required'),
  testMode: z.boolean().optional(),
  mockDelay: z
    .union([
      z.nativeEnum(TIAProviderMockDelayEnum),
      z.number().int().min(1, 'Custom delay must be at least 1 second'),
    ])
    .optional(),
});

export const classifyProductDtoServiceSchema = classifyProductDtoBodySchema;

export type TClassifyProductDtoBodySchema = z.infer<
  typeof classifyProductDtoBodySchema
>;

export type TClassifyProductDtoServiceSchema = z.infer<
  typeof classifyProductDtoServiceSchema
>;
