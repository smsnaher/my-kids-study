
import { db } from '../firebase/config';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

export interface ExamSubmission {
  examId: string;
  userId: string;
  answers: { [questionId: string]: string };
  submittedAt: Date;
}


// Upsert: update if exists, otherwise add new
export async function submitExam(examId: string, userId: string, answers: { [questionId: string]: string }) {
  const submissionsRef = collection(db, 'examSubmissions');
  const q = query(submissionsRef, where('examId', '==', examId), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const submission: ExamSubmission = {
    examId,
    userId,
    answers,
    submittedAt: new Date(),
  };
  if (!snapshot.empty) {
    // Update the first found document
    const docRef = doc(db, 'examSubmissions', snapshot.docs[0].id);
    await updateDoc(docRef, {
      answers,
      submittedAt: new Date(),
    });
  } else {
    // Add new document
    await addDoc(submissionsRef, submission);
  }
}
