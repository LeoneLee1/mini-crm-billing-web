export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  unit: string;
  category?: string;
}

export interface UpdateProductPayload {
  name: string;
  description?: string;
  price: number;
  unit: string;
  category?: string;
  is_active: boolean;
}
