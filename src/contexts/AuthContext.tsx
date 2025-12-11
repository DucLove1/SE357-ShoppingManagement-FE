import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'seller' | 'customer';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users cho demo
const mockUsers: Record<string, { password: string; user: User }> = {
  'admin@shop.com': {
    password: 'admin123',
    user: {
      id: '1',
      name: 'Quản trị viên',
      email: 'admin@shop.com',
      role: 'admin',
    },
  },
  'seller@shop.com': {
    password: 'seller123',
    user: {
      id: '2',
      name: 'Nhân viên bán hàng',
      email: 'seller@shop.com',
      role: 'seller',
    },
  },
  'customer@shop.com': {
    password: 'customer123',
    user: {
      id: '3',
      name: 'Nguyễn Văn A',
      email: 'customer@shop.com',
      role: 'customer',
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    const userRecord = mockUsers[email];
    if (userRecord && userRecord.password === password) {
      setUser(userRecord.user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
