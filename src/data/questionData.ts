import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';

export interface Question {
  id?: string;
  examId: string;
  type: string;
  createdAt: Timestamp | Date;
  data?: number[];
}

// Save a question to the 'questions' collection for a specific exam
// Accepts optional data for sum questions
// Save a question to the 'questions' collection for a specific exam
// Accepts optional data for sum questions and groupTypeId
export async function saveQuestionToExam(examId: string, type: string, data?: number[], groupTypeId?: string) {
  const question: Question & { groupTypeId?: string } = {
    examId,
    type,
    createdAt: new Date(),
  };
  if (data && Array.isArray(data)) {
    question.data = data;
  }
  if (groupTypeId) {
    question.groupTypeId = groupTypeId;
  }
  await addDoc(collection(db, 'questions'), question);
}

// Fetch all questions for a specific exam
export async function fetchQuestionsByExamId(examId: string): Promise<Question[]> {
  const q = query(collection(db, 'questions'), where('examId', '==', examId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Question[];
}
