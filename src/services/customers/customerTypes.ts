export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerPayload {
  name: string;
  email?: string;
  phone: string;
  address: string;
}

export interface UpdateCustomerPayload {
  name: string;
  email?: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
}
