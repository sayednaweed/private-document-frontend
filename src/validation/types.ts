import { User } from "@/database/tables";
import { DateObject } from "react-multi-date-picker";

export type ValidationRule = "required" | `max:${number}` | `min:${number}`;
export interface ValidateItem {
  name: string;
  rules: ValidationRule[];
}
export interface UserData {
  name: string;
  data: any;
}
export type Order = "Ascending" | "Descending";
export type UserSort =
  | "created_at"
  | "username"
  | "department"
  | "status"
  | "job";
export type UserSearch = "username" | "contact" | "email";
export interface UserFilter {
  sort: UserSort;
  order: Order;
  search: {
    column: UserSearch;
    value: string;
  };
  date: DateObject[];
}
export interface PaginationData {
  data: User[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}
