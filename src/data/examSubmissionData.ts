
import { db } from '../firebase/config';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

export interface ExamSubmission {
  examId: string;
  userId: string;
  answers: { [questionId: string]: string };
  submittedAt: Date;
}


// Upsert: update if exists, otherwise add new

// Upsert: update if exists, otherwise add new. If submitted=true, add/update the 'submitted' key.
export async function submitExam(examId: string, userId: string, answers: { [questionId: string]: string }, submitted: boolean = false) {
  const submissionsRef = collection(db, 'examSubmissions');
  const q = query(submissionsRef, where('examId', '==', examId), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const submission: any = {
    examId,
    userId,
    answers,
    submittedAt: new Date(),
  };
  if (submitted) submission.submitted = true;
  if (!snapshot.empty) {
    // Update the first found document
    const docRef = doc(db, 'examSubmissions', snapshot.docs[0].id);
    const updateData: any = {
      answers,
      submittedAt: new Date(),
    };
    if (submitted) updateData.submitted = true;
    await updateDoc(docRef, updateData);
  } else {
    // Add new document
    await addDoc(submissionsRef, submission);
  }
}
