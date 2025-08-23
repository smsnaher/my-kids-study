import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

export interface ExamAssignment {
  examId: string;
  userIds: string[];
  assignedAt: Date;
  submitted?: boolean;
}

export async function assignExamToUsers(examId: string, userIds: string[], submitted?: boolean) {
  const assignment: ExamAssignment = {
    examId,
    userIds,
    assignedAt: new Date(),
  };
  if (submitted) assignment.submitted = true;
  await addDoc(collection(db, 'examAssignments'), assignment);
}
