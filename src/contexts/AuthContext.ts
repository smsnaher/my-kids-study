import { createContext } from 'react';
import type { User } from 'firebase/auth';
import type { UserData } from '../firebase/auth';

export interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  refreshUserData: () => Promise<void>;
  switchUserRole: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userData: null,
  loading: true,
  refreshUserData: async () => {},
  switchUserRole: async () => {},
});
