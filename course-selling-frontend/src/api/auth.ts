import { api } from "./axios";
import type { Role, User } from "../types";

interface SignupPayload {
  email: string;
  password: string;
  name: string;
  role: Role;
}

interface LoginPayload {
  email: string;
  password: string;
}

// POST /auth/signup -> { message, user }
export function signup(payload: SignupPayload) {
  return api.post<{ message: string; user: User }>("/auth/signup", payload);
}

// POST /auth/login -> { message, token }
export function login(payload: LoginPayload) {
  return api.post<{ message: string; token: string }>("/auth/login", payload);
}

// GET /me (requires Authorization header, added automatically by the axios interceptor)
export function getMe() {
  return api.get<User>("/me");
}
