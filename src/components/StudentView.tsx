import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchAssignedExamsForUser } from '../data/assignedExamData';
import { fetchExamById } from '../data/examData';
import { Link } from 'react-router-dom';
import type { Exam } from '../data/examData';

export const StudentView: React.FC = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [exams, setExams] = useState<Exam[]>([]);

    useEffect(() => {
        if (!currentUser) return;
        setLoading(true);
        fetchAssignedExamsForUser(currentUser.uid).then(async (ids) => {
            const examObjs = await Promise.all(ids.map(id => fetchExamById(id)));
            setExams(examObjs.filter(Boolean) as Exam[]);
            setLoading(false);
        });
    }, [currentUser]);

    if (!currentUser) return <div>Please log in as a student to view your exams.</div>;
    if (loading) return <div>Loading assigned exams...</div>;

    // Unique exams
    const uniqueExams = Array.from(new Map(exams.map(e => [e.id || e.docId, e])).values());

    return (
        <div>
            <h2>👨‍🎓 My Exams</h2>
            {uniqueExams.length === 0 ? (
                <div>No exams assigned to you.</div>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {uniqueExams.map(exam => (
                        <li key={exam.id || exam.docId} style={{ marginBottom: 16 }}>
                            <Link to={`/kids-study/exam/${exam.id || exam.docId}`} style={{ fontSize: 18, textDecoration: 'underline', color: '#0077ff' }}>
                                {exam.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
