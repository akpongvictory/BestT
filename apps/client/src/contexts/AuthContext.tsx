import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { getCurrentUser } from "../services/auth";
import {
  getToken,
  setToken,
  removeToken,
} from "../utils/token";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();
        setUser(response.data);
      } catch {
        removeToken();
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = (token: string, user: User) => {
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }

  return context;
}