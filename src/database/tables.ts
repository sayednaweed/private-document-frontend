export type Role =
  | { role: 3; name: "user" }
  | { role: 2; name: "admin" }
  | { role: 4; name: "super" }
  | { role: 10; name: "debugger" };
export type Permission = {
  name: string;
};
export type UserPermission = {
  id: number;
  edit: boolean;
  view: boolean;
  delete: boolean;
  add: boolean;
  permission: string;
  icon: string;
  priority: number;
};
export type SelectUserPermission = UserPermission & {
  allSelected: boolean;
};
export type Contact = {
  id: string;
  value: string;
  createdAt: string;
};
export type Email = {
  id: string;
  value: string;
  createdAt: string;
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
  destination: string;
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
export type Job = {
  id: string;
  name: string;
  createdAt: string;
};
// APPLICATION

export type Status = {
  id: string;
  name: string;
  color: string;
  createdAt: string;
};
export type Urgency = {
  id: string;
  name: string;
  createdAt: string;
};
export type Source = {
  id: string;
  name: string;
  createdAt: string;
};
export type Scan = {
  id: string;
  initailScan: string;
  muqamScan: string;
  finalScan: string;
};
export type DocumentType = {
  id: string;
  name: string;
  createdAt: string;
};

export type DocumentModel = {
  id: string;
  documentNumber: string;
  summary: string;
  muqamStatement: string;
  qaidWaridaNumber: string;
  qaidSadiraNumber: string;
  savedFile: string;
  documentDate: string;
  userRecievedDate: string;
  qaidSadiraDate: string;
  qaidWaridaDate: string;
  deadline: string;
  status: string;
  statusColor: string;
  urgency: string;
  source: string;
  scan: Scan;
  reciverUserId: User;
  createdAt: string;
  type: string;
};
export type DestinationType = {
  id: string;
  name: string;
  createdAt: string;
};
export type Destination = {
  id: string;
  name: string;
  color: string;
  type: DestinationType;
  createdAt: string;
};

export type Audit = {
  id: string;
  user_id: string;
  user: string;
  action: string;
  table: string;
  table_id: string;
  old_values: any;
  new_values: any;
  url: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
};
export type Progress = {
  id: string;
  step: number;
  statusId: number;
  oldDoc: boolean;
  sendDate: string;
  feedback: string;
  feedbackDate: string;
  destination: string;
  color: string;
  username: string;
};
