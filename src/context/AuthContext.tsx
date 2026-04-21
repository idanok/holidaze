import { createContext, useContext, useState, type ReactNode } from 'react';
import { getToken, getUser, saveToken, saveUser, clearToken, clearUser } from '../utils/storage';

export interface User {
  name: string;
  email: string;
  venueManager: boolean;
  avatar?: { url: string; alt: string };
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoggedIn: boolean;
  isVenueManager: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getToken());
  const [user, setUser] = useState<User | null>(getUser());

  const login = (newToken: string, newUser: User) => {
    saveToken(newToken);
    saveUser(newUser);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    clearToken();
    clearUser();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      token,
      user,
      login,
      logout,
      isLoggedIn: !!token,
      isVenueManager: user?.venueManager === true,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}