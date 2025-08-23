import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role?: string;
  createdAt?: any;
}

export async function fetchAllUsers(): Promise<User[]> {
  const querySnapshot = await getDocs(collection(db, 'users'));
  return querySnapshot.docs.map(doc => ({
    uid: doc.id,
    ...doc.data(),
  })) as User[];
}
