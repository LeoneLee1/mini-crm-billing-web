import api from "@/lib/axios";
import { CreateUserPayload, UpdateUserPayload } from "./userTypes";

export const getUsers = (params?: { page?: number; limit?: number }) =>
  api.get("/users", { params }).then((r) => r.data);

export const getUserById = (id: string) => api.get(`/users/${id}`).then((r) => r.data);

export const createUser = (payload: CreateUserPayload) => api.post("/users", payload).then((r) => r.data);

export const updateUser = (id: string, payload: UpdateUserPayload) =>
  api.put(`/users/${id}`, payload).then((r) => r.data);

export const deleteUser = (id: string) => api.delete(`/users/${id}`).then((r) => r.data);
