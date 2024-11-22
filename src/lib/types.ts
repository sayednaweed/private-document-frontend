import { DocumentModel, SelectUserPermission, User } from "@/database/tables";
import { DateObject } from "react-multi-date-picker";

export interface IMenuItem {
  name: string;
  key: string;
}
export interface UserInformation {
  profile: any;
  imagePreviewUrl: any;
  fullName: string;
  username: string;
  password: string;
  email: string;
  status: boolean;
  grantPermission: boolean;
  job: {
    id: string;
    name: string;
    selected: boolean;
  };
  role: {
    id: string;
    name: string;
    selected: boolean;
  };
  contact: string;
  destination: {
    id: string;
    name: string;
    selected: boolean;
  };
  permission: Map<string, SelectUserPermission>;
  allSelected: boolean;
  createdAt: string;
}
export interface UserPassword {
  oldPassword?: string;
  newPassword: string;
  confirmPassword: string;
}
export interface UserPaginationData {
  data: User[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}
// Filter
export interface UserData {
  name: string;
  data: any;
}
export type Order = "desc" | "asc";
export type UserSort = "date" | "username" | "destination" | "status" | "job";
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
export interface DocumentPaginationData {
  data: DocumentModel[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}
export type DocumentSort =
  | "source"
  | "status"
  | "document no"
  | "document date"
  | "remaining time";
export type DocumentSearch = "id" | "document no";
export interface DocumentFilter {
  sort: DocumentSort;
  order: Order;
  search: {
    column: DocumentSearch;
    value: string;
  };
  date: DateObject[];
}
export interface UserRecordCount {
  activeUserCount: number | null;
  inActiveUserCount: number | null;
  todayCount: number | null;
  userCount: number | null;
}
export interface DocumentRecordCount {
  inProgress: number | null;
  completed: number | null;
  keep: number | null;
  total: number | null;
}
