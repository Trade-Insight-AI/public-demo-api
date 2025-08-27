import { IApiDocumentationOptions } from '@/@decorators/api-documentation.decorator';
import {
  ClassifyProductRequestDoc,
  ClassificationResultResponseDoc,
} from './classify-product.doc';

export const ClassifyProductDocumentation: IApiDocumentationOptions = {
  summary: 'Classify a single product',
  description: `Classify a product description using the specified AI engine. Supports test mode with configurable mock delays.
**Response Structure:**
Returns detailed classification information including chapters, headings, final classification, and billing details.`,
  tags: ['classifications'],
  auth: true,
  body: {
    description: 'Product classification request',
    type: ClassifyProductRequestDoc,
  },
  responses: {
    success: {
      status: 200,
      description: 'Product successfully classified',
      type: ClassificationResultResponseDoc,
    },
    badRequest: {
      description: 'Invalid request body or parameters',
    },
  },
};
