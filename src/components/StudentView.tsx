import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchAssignedExamsForUser } from '../data/assignedExamData';
import { fetchExamById } from '../data/examData';
import { fetchQuestionsByExamId } from '../data/questionData';
import { sumStudentTemplate } from '../utils/templates';
import SumQuestionStudent from './questions/SumQuestionStudent';
import { submitExam } from '../data/examSubmissionData';

export const StudentView: React.FC = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [examIds, setExamIds] = useState<string[]>([]);
    const [exams, setExams] = useState<any[]>([]);
    const [questions, setQuestions] = useState<{ [examId: string]: any[] }>({});
    const [answers, setAnswers] = useState<{ [examId: string]: { [questionId: string]: string } }>({});
    const [submitting, setSubmitting] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        if (!currentUser) return;
        setLoading(true);
        fetchAssignedExamsForUser(currentUser.uid).then(async (ids) => {
            setExamIds(ids);
            // Fetch exam details
            const examObjs = await Promise.all(ids.map(id => fetchExamById(id)));
            setExams(examObjs.filter(Boolean));
            // Fetch questions for each exam
            const qMap: { [examId: string]: any[] } = {};
            for (const exam of examObjs) {
                if (exam) {
                    qMap[exam.id || exam.docId] = await fetchQuestionsByExamId(exam.id || exam.docId);
                }
            }
            setQuestions(qMap);
            setLoading(false);
        });
    }, [currentUser]);

    const handleAnswerChange = (examId: string, questionId: string, value: string) => {
        setAnswers(a => ({
            ...a,
            [examId]: {
                ...(a[examId] || {}),
                [questionId]: value,
            },
        }));
    };

    const handleSubmit = async (examId: string) => {
        if (!currentUser) return;
        setSubmitting(examId);
        setSubmitError(null);
        try {
            await submitExam(examId, currentUser.uid, answers[examId] || {});
            setSubmitSuccess(examId);
            setTimeout(() => setSubmitSuccess(null), 2000);
        } catch {
            setSubmitError('Failed to submit exam.');
        } finally {
            setSubmitting(null);
        }
    };

    if (!currentUser) return <div>Please log in as a student to view your exams.</div>;
    if (loading) return <div>Loading assigned exams...</div>;

    return (
        <div>
            <h2>👨‍🎓 Student View</h2>
            {exams.length === 0 ? (
                <div>No exams assigned to you.</div>
            ) : (
                // Remove duplicate exams by id/docId
                Array.from(new Map(exams.map(e => [e.id || e.docId, e])).values()).map(exam => (
                    <div key={exam.id || exam.docId} style={{ border: '1px solid #ccc', borderRadius: 8, marginBottom: 24, padding: 16 }}>
                        <h3>{exam.name}</h3>
                        <form onSubmit={e => { e.preventDefault(); handleSubmit(exam.id || exam.docId); }}>
                            {(questions[exam.id || exam.docId] || []).map(q => (
                                <div key={q.id} style={{ marginBottom: 12 }}>
                                    {q.type === 'sum' && Array.isArray(q.data) ? (
                                        <SumQuestionStudent
                                            question={sumStudentTemplate(q.data)}
                                            value={answers[exam.id || exam.docId]?.[q.id] || ''}
                                            onChange={e => handleAnswerChange(exam.id || exam.docId, q.id, e.target.value)}
                                        />
                                    ) : (
                                        <>
                                            <div>{q.type}</div>
                                            <input
                                                type="text"
                                                value={answers[exam.id || exam.docId]?.[q.id] || ''}
                                                onChange={e => handleAnswerChange(exam.id || exam.docId, q.id, e.target.value)}
                                                style={{ marginTop: 4, padding: '4px 8px', fontSize: 15 }}
                                                placeholder="Your answer"
                                            />
                                        </>
                                    )}
                                </div>
                            ))}
                            <button
                                type="submit"
                                disabled={submitting === (exam.id || exam.docId)}
                                style={{ marginTop: 8, padding: '6px 18px', fontSize: 15, background: '#0077ff', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' }}
                            >
                                {submitting === (exam.id || exam.docId) ? 'Submitting...' : 'Submit Exam'}
                            </button>
                            {submitSuccess === (exam.id || exam.docId) && <span style={{ color: 'green', marginLeft: 12 }}>Submitted!</span>}
                            {submitError && <span style={{ color: 'red', marginLeft: 12 }}>{submitError}</span>}
                        </form>
                    </div>
                ))
            )}
        </div>
    );
};
