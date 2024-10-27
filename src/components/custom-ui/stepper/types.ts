import { ValidateItem } from "@/validation/types";

export interface ComponentStep {
  component: any;
  validationRules: ValidateItem[];
}
export type StepperSize = "sm" | "md" | "lg" | "full" | "wrap-height";
export type StepperHeightSize = "wrap-height";
