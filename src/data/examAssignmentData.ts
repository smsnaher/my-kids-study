import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

export interface ExamAssignment {
  examId: string;
  userIds: string[];
  assignedAt: Date;
}

export async function assignExamToUsers(examId: string, userIds: string[]) {
  const assignment: ExamAssignment = {
    examId,
    userIds,
    assignedAt: new Date(),
  };
  await addDoc(collection(db, 'examAssignments'), assignment);
}
