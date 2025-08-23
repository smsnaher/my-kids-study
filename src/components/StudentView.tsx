import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchAssignedExamsForUser } from '../data/assignedExamData';
import { fetchExamById } from '../data/examData';
import { fetchQuestionsByExamId } from '../data/questionData';
import { sumStudentTemplate } from '../utils/templates';
import SumQuestionStudent from './questions/SumQuestionStudent';
import { submitExam } from '../data/examSubmissionData';
import { fetchExamSubmission } from '../data/fetchExamSubmission';

export const StudentView: React.FC = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [examIds, setExamIds] = useState<string[]>([]);
    const [exams, setExams] = useState<any[]>([]);
    const [questions, setQuestions] = useState<{ [examId: string]: any[] }>({});
    const [answers, setAnswers] = useState<{ [examId: string]: { [questionId: string]: string } }>({});
    const [saving, setSaving] = useState<string | null>(null);
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
            const aMap: { [examId: string]: { [questionId: string]: string } } = {};
            for (const exam of examObjs) {
                if (exam) {
                    const examKey = exam.id || exam.docId;
                    qMap[examKey] = await fetchQuestionsByExamId(examKey);
                    // Fetch saved answers for this exam
                    const submission = await fetchExamSubmission(examKey, currentUser.uid);
                    if (submission && submission.answers) {
                        aMap[examKey] = submission.answers;
                    }
                }
            }
            setQuestions(qMap);
            setAnswers(aMap);
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

    // Save (draft) handler
    const handleSave = async (examId: string) => {
        if (!currentUser) return;
        setSaving(examId);
        setSubmitError(null);
        try {
            await submitExam(examId, currentUser.uid, answers[examId] || {}, false);
            setSubmitSuccess(examId + '-save');
            setTimeout(() => setSubmitSuccess(null), 2000);
        } catch {
            setSubmitError('Failed to save exam.');
        } finally {
            setSaving(null);
        }
    };

    // Submit (final) handler
    const handleSubmit = async (examId: string) => {
        if (!currentUser) return;
        setSubmitting(examId);
        setSubmitError(null);
        try {
            await submitExam(examId, currentUser.uid, answers[examId] || {}, true);
            setSubmitSuccess(examId + '-submit');
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
                                type="button"
                                disabled={saving === (exam.id || exam.docId)}
                                style={{ marginTop: 8, marginRight: 8, padding: '6px 18px', fontSize: 15, background: '#aaa', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' }}
                                onClick={() => handleSave(exam.id || exam.docId)}
                            >
                                {saving === (exam.id || exam.docId) ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                type="submit"
                                disabled={submitting === (exam.id || exam.docId)}
                                style={{ marginTop: 8, padding: '6px 18px', fontSize: 15, background: '#0077ff', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' }}
                            >
                                {submitting === (exam.id || exam.docId) ? 'Submitting...' : 'Submit Exam'}
                            </button>
                            {submitSuccess === (exam.id || exam.docId + '-save') && <span style={{ color: 'green', marginLeft: 12 }}>Saved!</span>}
                            {submitSuccess === (exam.id || exam.docId + '-submit') && <span style={{ color: 'green', marginLeft: 12 }}>Submitted!</span>}
                            {submitError && <span style={{ color: 'red', marginLeft: 12 }}>{submitError}</span>}
                        </form>
                    </div>
                ))
            )}
        </div>
    );
};
