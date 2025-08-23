import { db } from '../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

export interface Student {
  uid: string;
  email: string;
  displayName?: string;
  createdAt?: import('firebase/firestore').Timestamp | Date;
}

export async function fetchAllStudents(): Promise<Student[]> {
  const q = query(collection(db, 'users'), where('role', '==', 'student'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    uid: doc.id,
    ...doc.data(),
  })) as Student[];
}
