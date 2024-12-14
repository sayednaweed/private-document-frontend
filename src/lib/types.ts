import {
  Audit,
  DocumentModel,
  SelectUserPermission,
  User,
} from "@/database/tables";
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
  oldPassword: string;
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
export type UserSort =
  | "createdAt"
  | "username"
  | "destination"
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
  | "urgency"
  | "type"
  | "documentNumber"
  | "documentDate"
  | "deadline";
export type DocumentSearch = "id" | "documentNumber";
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
//
export interface AuditData {
  name: string;
  data: any;
}

export type AuditSort = "id" | "date" | "user" | "user_id" | "action" | "table";
export type AuditSearch = "user" | "user_id" | "table";
export type AuditFilterBy = "none" | "user" | "table" | "user_id";

export interface AuditFilter {
  sort: AuditSort;
  order: Order;
  filterBy: {
    column: AuditFilterBy;
    value: string;
  };
  search: {
    column: AuditSearch;
    value: string;
  };
  date: DateObject[];
}
export interface AuditPaginationData {
  data: Audit[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}

// Multiselector
export interface Option {
  name: string;
  label: string;
  disable?: boolean;
  /** fixed option that can't be removed. */
  fixed?: boolean;
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined;
}
