import api from "@/lib/axios";
import { LoginPayload, RegisterPayload, UpdatePasswordPayload, UpdateProfilePayload } from "./authTypes";

export const login = (payload: LoginPayload) => api.post("/auth/login", payload).then((r) => r.data);

export const register = (payload: RegisterPayload) => api.post("/auth/register", payload).then((r) => r.data);

export const getProfile = () => api.get("/auth/profile").then((r) => r.data);

export const updateProfile = (payload: UpdateProfilePayload) => api.put("/auth/profile/update", payload).then((r) => r.data);

export const updatePassword = (payload: UpdatePasswordPayload) => api.put("/auth/profile/update-password", payload).then((r) => r.data);
