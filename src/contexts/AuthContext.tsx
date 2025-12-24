import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

export type UserRole = 'admin' | 'seller' | 'customer';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
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
  const [user, setUser] = useState<User | null>(() => {
    // Try to restore user data from localStorage on init
    const savedUserData = localStorage.getItem('user_data');
    if (savedUserData) {
      try {
        return JSON.parse(savedUserData);
      } catch {
        return null;
      }
    }
    return null;
  });

  const mapRole = (role: string): UserRole => {
    if (role === 'admin' || role === 'seller' || role === 'customer') return role;
    if (role === 'buyer') return 'customer';
    return 'customer';
  };

  // const login = (email: string, password: string): boolean => {
  //   const userRecord = mockUsers[email];
  //   if (userRecord && userRecord.password === password) {
  //     setUser(userRecord.user);
  //     return true;
  //   }
  //   return false;
  // };


  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post('/api/auth/local/login', {
        email,
        password,
      });

      if (res.status === 200 && res.data?.success && res.data?.data) {
        const data = res.data.data;
        const u = data.user;
        const accessToken = data.access_token as string | undefined;

        if (accessToken) {
          localStorage.setItem('access_token', accessToken);
        }

        if (u) {
          const userData = {
            id: u.id,
            name: (u.full_name as string) || '',
            email: u.email,
            role: mapRole(String(u.role)),
            phone: u.phone_number || '',
            avatar: u.avatar || '',
            address: u.address || '',
            dateOfBirth: u.date_of_birth || '',
            gender: u.gender || '',
          };

          // Save full user data to localStorage
          localStorage.setItem('user_data', JSON.stringify(userData));

          setUser(userData);
        }

        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };


  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
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
