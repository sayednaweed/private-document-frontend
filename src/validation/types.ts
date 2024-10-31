export type ValidationRule = "required" | `max:${number}` | `min:${number}`;
export interface ValidateItem {
  name: string;
  rules: ValidationRule[];
}
