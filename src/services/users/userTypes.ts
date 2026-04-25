export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
  created_at: string;
  updated_at: string;
}

export interface UserListData {
  users: User[];
  total: number;
  page: number;
  limit: number;
  total_page: number;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: "admin" | "staff";
}

export interface UpdateUserPayload {
  name: string;
  email: string;
  role: "admin" | "staff";
}
