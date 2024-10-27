import { SelectUserPermission } from "@/database/tables";

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
  department: {
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
