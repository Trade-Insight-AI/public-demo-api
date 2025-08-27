import { TiaProviderMockDelayEnum } from '@/@shared/providers/tia-provider/models/tia-provider.enums';
import { ApiProperty } from '@nestjs/swagger';

// Request DTO Documentation
export class ClassifyProductRequestDoc {
  @ApiProperty({
    description: 'Product description to be classified',
    example: 'High-quality stainless steel kitchen knife with ergonomic handle',
    minLength: 1,
  })
  productDescription: string;

  @ApiProperty({
    description: 'AI engine to use for classification',
    example: 'E4-1',
  })
  engine: string;

  @ApiProperty({
    description: 'Enable test mode for classification',
    example: false,
    required: false,
  })
  testMode?: boolean;

  @ApiProperty({
    description: 'Mock delay configuration for test mode',
    oneOf: [
      {
        type: 'string',
        enum: Object.values(TiaProviderMockDelayEnum),
        description: 'Predefined delay option',
      },
      {
        type: 'integer',
        minimum: 1,
        description: 'Custom delay in seconds',
      },
    ],
    example: TiaProviderMockDelayEnum.REALISTIC,
    required: false,
  })
  mockDelay?: TiaProviderMockDelayEnum | number;
}

// Response DTO Documentation
export class ClassifyProductInitialChapterDoc {
  @ApiProperty({
    description: 'Chapter number identifier',
    example: '01',
  })
  chapterNumber: string;

  @ApiProperty({
    description: 'Chapter title',
    example: 'Live animals',
  })
  title: string;

  @ApiProperty({
    description: 'Reasoning for chapter selection',
    example: 'The product is a living organism that falls under chapter 01',
  })
  reasoning: string;
}

export class ClassifyProductFinalChapterDoc {
  @ApiProperty({
    description: 'Final chapter number',
    example: '01',
  })
  chapterNumber: string;

  @ApiProperty({
    description: 'Justification for final chapter selection',
    example:
      'Based on the product description, this is the most appropriate chapter',
  })
  justification: string;
}

export class ClassifyProductHeadingDoc {
  @ApiProperty({
    description: 'Heading identifier',
    example: '0101',
  })
  heading: string;

  @ApiProperty({
    description: 'Heading description',
    example: 'Horses, asses, mules and hinnies, live',
  })
  description: string;

  @ApiProperty({
    description: 'Reasoning for heading selection',
    example: 'The product matches the description of live horses',
  })
  reasoning: string;

  @ApiProperty({
    description: 'TIA identifier for the heading',
    example: 101,
  })
  tiaId: number;
}

export class ClassifyProductFinalHeadingDoc {
  @ApiProperty({
    description: 'Final heading identifier',
    example: '0101',
  })
  heading: string;

  @ApiProperty({
    description: 'Final heading description',
    example: 'Horses, asses, mules and hinnies, live',
  })
  description: string;

  @ApiProperty({
    description: 'Rationale for final heading selection',
    example: 'This heading best matches the product characteristics',
  })
  rationale: string;

  @ApiProperty({
    description: 'TIA identifier for the final heading',
    example: 101,
  })
  tiaId: number;
}

export class ClassifyProductFinalClassificationDoc {
  @ApiProperty({
    description: 'Final classification result',
    example: '01012100',
  })
  result: string;
}

export class ClassifyProductBillingDoc {
  @ApiProperty({
    description: 'Base cost before discount',
    example: 10,
  })
  base_cost: number;

  @ApiProperty({
    description: 'Discount percentage applied',
    example: 0.1,
  })
  discount_percent: number;

  @ApiProperty({
    description: 'Final cost after discount',
    example: 9,
  })
  final_cost: number;

  @ApiProperty({
    description: 'Remaining balance after payment',
    example: 91,
  })
  remaining_balance: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'USD',
  })
  currency: string;
}

export class ClassifyProductResultDataDoc {
  @ApiProperty({
    description: 'Initial chapters considered',
    type: [ClassifyProductInitialChapterDoc],
  })
  initialChapters: ClassifyProductInitialChapterDoc[];

  @ApiProperty({
    description: 'Final selected chapter',
    type: ClassifyProductFinalChapterDoc,
  })
  finalChapter: ClassifyProductFinalChapterDoc;

  @ApiProperty({
    description: 'Headings considered',
    type: [ClassifyProductHeadingDoc],
  })
  headings: ClassifyProductHeadingDoc[];

  @ApiProperty({
    description: 'Final selected heading',
    type: ClassifyProductFinalHeadingDoc,
  })
  finalHeading: ClassifyProductFinalHeadingDoc;

  @ApiProperty({
    description: 'Final classification result',
    type: ClassifyProductFinalClassificationDoc,
  })
  finalClassification: ClassifyProductFinalClassificationDoc;
}

export class ClassifyProductResultDoc {
  @ApiProperty({
    description: 'Status of the classification',
    example: 'success',
  })
  status: string;

  @ApiProperty({
    description: 'Message describing the result',
    example: 'Product classified successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Classification result data',
    type: ClassifyProductResultDataDoc,
  })
  data: ClassifyProductResultDataDoc;
}

export class ClassifyProductDataDoc {
  @ApiProperty({
    description: 'Unique identifier for the classification',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'AI engine used for classification',
    example: 'E4-1',
  })
  engine: string;

  @ApiProperty({
    description: 'Timestamp of the classification',
    example: '2024-08-19T10:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Classification result details',
    type: ClassifyProductResultDoc,
  })
  result: ClassifyProductResultDoc;

  @ApiProperty({
    description: 'Billing information',
    type: ClassifyProductBillingDoc,
  })
  billing: ClassifyProductBillingDoc;

  @ApiProperty({
    description: 'Request identifier',
    example: 'req-123456789',
  })
  requestId: string;
}

export class ClassificationResultResponseDoc {
  @ApiProperty({
    description: 'Response message',
    example: 'Product classification completed successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Classification result data',
    type: ClassifyProductDataDoc,
  })
  data: ClassifyProductDataDoc;
}
