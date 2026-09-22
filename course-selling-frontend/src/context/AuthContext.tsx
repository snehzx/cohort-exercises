import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getMe, login as loginRequest, signup as signupRequest } from "../api/auth";
import type { Role, User } from "../types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: Role) => Promise<void>;
  logout: () => void;
}

// React Context is how we share "who is logged in" with every component
// in the tree without passing props down manually through each level.
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On first load, check if a token is already sitting in localStorage
  // (e.g. the user refreshed the page). If so, ask the backend who that
  // token belongs to via GET /me, so we don't force a re-login every refresh.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((res) => setUser(res.data))
      .catch(() => {
        // token expired/invalid -> clear it
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const res = await loginRequest({ email, password });
    localStorage.setItem("token", res.data.token);
    const me = await getMe();
    setUser(me.data);
  }

  async function signup(email: string, password: string, name: string, role: Role) {
    await signupRequest({ email, password, name, role });
    // Signup doesn't return a token, so log the new user in right after.
    await login(email, password);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so components just call useAuth() instead of importing
// useContext + AuthContext everywhere.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
