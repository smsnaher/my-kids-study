import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Exam interface
 * - docId: Firestore document ID (always unique, used for lookups)
 * - id: internal exam id field (may be different or missing)
 */
export interface Exam {
  docId: string; // Firestore document ID
  id?: string;   // internal id field (optional)
  name: string;
  userId: string;
  createdAt: any;
}

export async function fetchExamById(id: string): Promise<Exam | null> {
  // Query the collection for the document where id == given id
  const examsRef = collection(db, 'examinations');
  const q = query(examsRef, where('id', '==', id));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();
    return {
      docId: data.id, // now docId is the 'id' field from the document
      id: data.id,
      name: data.name,
      userId: data.userId,
      createdAt: data.createdAt,
    };
  }
  return null;
}

export async function getExamDetailById(id: string, setExam: (exam: Exam | null) => void, setLoading: (loading: boolean) => void, setFetchError: (err: string | null) => void) {
  if (!id) return;
  setLoading(true);
  setFetchError(null);
  try {
  const examData = await fetchExamById(id);
    if (examData) {
      setExam(examData);
    } else {
      setFetchError('Exam not found');
    }
  } catch (err) {
    setFetchError('Failed to fetch exam');
  } finally {
    setLoading(false);
  }
}
