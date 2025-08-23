import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function fetchExamSubmission(examId: string, userId: string) {
  const submissionsRef = collection(db, 'examSubmissions');
  const q = query(submissionsRef, where('examId', '==', examId), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return snapshot.docs[0].data();
  }
  return null;
}
