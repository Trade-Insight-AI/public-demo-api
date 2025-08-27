export interface ITIAProviderClassifyProductDetailsInitialChapter {
  chapterNumber: string;
  title: string;
  reasoning: string;
}

export interface ITIAProviderClassifyProductDetailsFinalChapter {
  chapterNumber: string;
  justification: string;
}

export interface ITIAProviderClassifyProductDetailsHeading {
  heading: string;
  description: string;
  reasoning: string;
  tiaId: number;
}

export interface ITIAProviderClassifyProductDetailsFinalHeading {
  heading: string;
  description: string;
  rationale: string;
  tiaId: number;
}

export interface ITIAProviderClassifyProductDetailsFinalClassification {
  result: string;
}

export interface ITIAProviderClassifyProductDetailsBilling {
  base_cost: number;
  discount_percent: number;
  final_cost: number;
  remaining_balance: number;
  currency: string;
}

export interface ITIAProviderClassifyProductDetailsResultData {
  initialChapters: ITIAProviderClassifyProductDetailsInitialChapter[];
  finalChapter: ITIAProviderClassifyProductDetailsFinalChapter;
  headings: ITIAProviderClassifyProductDetailsHeading[];
  finalHeading: ITIAProviderClassifyProductDetailsFinalHeading;
  finalClassification: ITIAProviderClassifyProductDetailsFinalClassification;
}

export interface ITIAProviderClassifyProductDetailsResult {
  status: string;
  message: string;
  data: ITIAProviderClassifyProductDetailsResultData;
}

export interface ITIAProviderClassifyProductDetailsData {
  id: string;
  engine: string;
  timestamp: string;
  result: ITIAProviderClassifyProductDetailsResult;
  billing: ITIAProviderClassifyProductDetailsBilling;
  requestId: string;
}

export interface ITIAProviderClassifyProductDetails {
  message: string;
  data: ITIAProviderClassifyProductDetailsData;
}
