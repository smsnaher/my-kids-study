import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../firebase/config';
import { getUserData, updateUserRole } from '../firebase/auth';
import type { UserData } from '../firebase/auth';
import { AuthContext } from './AuthContext.ts';

interface AuthProviderProps {
  children: React.ReactNode;
}


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserData = async () => {
    if (currentUser) {
      try {
        const data = await getUserData(currentUser.uid);
        setUserData(data);
      } catch (error) {
        console.error('Error refreshing user data:', error);
        setUserData(null);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const data = await getUserData(user.uid);
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const switchUserRole = async () => {
    if (!userData || !currentUser) return;
    const newRole = userData.role === 'teacher' ? 'student' : 'teacher';
    try {
      await updateUserRole(currentUser.uid, newRole);
      await refreshUserData();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const value = {
    currentUser,
    userData,
    loading,
    refreshUserData,
    switchUserRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
