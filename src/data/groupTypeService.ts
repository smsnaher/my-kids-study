import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

export const addQuestionGroupType = async (examId: string, type: string, mark: string) => {
  const docRef = await addDoc(collection(db, 'examQuestionGroupType'), {
    examId,
    type,
    mark,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const fetchGroupTypesByExamId = async (examId: string) => {
  const q = query(collection(db, 'examQuestionGroupType'), where('examId', '==', examId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/* fetch all group types */
export const fetchAllGroupTypes = async () => {
  const querySnapshot = await getDocs(collection(db, 'examQuestionGroupType'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};