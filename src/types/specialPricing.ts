export interface SpecialPricing {
  id: string;
  fieldId: string;
  specificDate: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  price: number;
}

export interface SpecialPricingInput {
  specificDate: string;
  startTime: string;
  endTime: string;
  price: number;
}