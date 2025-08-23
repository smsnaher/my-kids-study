import { db } from '../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function fetchAssignedExamsForUser(userId: string): Promise<string[]> {
  const q = query(collection(db, 'examAssignments'), where('userIds', 'array-contains', userId));
  const querySnapshot = await getDocs(q);
  // Return all examIds assigned to this user
  return querySnapshot.docs.map(doc => doc.data().examId);
}
