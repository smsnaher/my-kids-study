
import { TeacherExamDetail } from "./tabs/TeacherExamDetail";
import { StudentExamDetail } from "./tabs/StudentExamDetail";
import { useAuth } from '../hooks/useAuth';
import { useState } from "react";


const ExamDetail = () => {
    const { userData } = useAuth();
    const [userRole] = useState(userData?.role || 'teacher');

    if (userRole === 'teacher') return <TeacherExamDetail />;
    return <StudentExamDetail />;
};

export default ExamDetail;