export type Role = { role: 2; name: "admin" } | { role: 4; name: "super" };
export type Permission = {
  name: string;
};
export type UserPermission = {
  id: number;
  edit: boolean;
  view: boolean;
  delete: boolean;
  add: boolean;
  permission_name: string;
  icon: string;
  priority: number;
};
export type SelectUserPermission = UserPermission & {
  allSelected: boolean;
};
export type User = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  status: boolean;
  grantPermission: boolean;
  profile: any;
  role: Role;
  contact: string;
  job: string;
  department: string;
  permissions: Map<string, UserPermission>;
  createdAt: string;
};

export type Notifications = {
  id: string;
  message: string;
  type: string;
  read_status: number;
  created_at: string;
};
export type Department = {
  id: string;
  name: string;
  createdAt: string;
};
export type Job = {
  id: string;
  name: string;
  createdAt: string;
};
