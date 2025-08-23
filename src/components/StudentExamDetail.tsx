import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchExamById } from '../data/examData';
import { fetchQuestionsByExamId } from '../data/questionData';
import { fetchExamSubmission } from '../data/fetchExamSubmission';
import { useAuth } from '../hooks/useAuth';
import { sumStudentTemplate } from '../utils/templates';
import SumQuestionStudent from './questions/SumQuestionStudent';
import { submitExam } from '../data/examSubmissionData';

const StudentExamDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [exam, setExam] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        if (!id || !currentUser) return;
        setLoading(true);
        fetchExamById(id).then(setExam);
        fetchQuestionsByExamId(id).then(setQuestions);
        fetchExamSubmission(id, currentUser.uid).then(sub => {
            if (sub && sub.answers) setAnswers(sub.answers);
            setLoading(false);
        });
    }, [id, currentUser]);

    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswers(a => ({ ...a, [questionId]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !id) return;
        setSubmitting(true);
        setSubmitError(null);
        try {
            await submitExam(id, currentUser.uid, answers, true);
            setSubmitSuccess(true);
            setTimeout(() => {
                setSubmitSuccess(false);
                navigate('/kids-study/');
            }, 2000);
        } catch {
            setSubmitError('Failed to submit exam.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !id) return;
        setSaving(true);
        setSubmitError(null);
        try {
            await submitExam(id, currentUser.uid, answers, false);

            setTimeout(() => {
                setSaveSuccess(true);
                navigate('/kids-study/');
            }, 2000);
            
            setTimeout(() => setSaveSuccess(false), 2000);
        } catch {
            setSubmitError('Failed to save answers.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!exam) return <div>Exam not found.</div>;

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2>{exam.name}</h2>
            <form onSubmit={handleSubmit}>
                {questions.map(q => (
                    <div key={q.id} style={{ marginBottom: 16 }}>
                        {q.type === 'sum' && Array.isArray(q.data) ? (
                            <SumQuestionStudent
                                question={sumStudentTemplate(q.data)}
                                value={answers[q.id] || ''}
                                onChange={e => handleAnswerChange(q.id, e.target.value)}
                            />
                        ) : (
                            <>
                                <div>{q.type}</div>
                                <input
                                    type="text"
                                    value={answers[q.id] || ''}
                                    onChange={e => handleAnswerChange(q.id, e.target.value)}
                                    style={{ marginTop: 4, padding: '4px 8px', fontSize: 15 }}
                                    placeholder="Your answer"
                                />
                            </>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    disabled={saving}
                    style={{ marginTop: 8, marginRight: 8, padding: '6px 18px', fontSize: 15, background: '#aaa', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' }}
                    onClick={handleSave}
                >
                    {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    style={{ marginTop: 8, padding: '6px 18px', fontSize: 15, background: '#0077ff', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' }}
                >
                    {submitting ? 'Submitting...' : 'Submit Exam'}
                </button>
                {saveSuccess && <span style={{ color: 'green', marginLeft: 12 }}>Saved!</span>}
                {submitSuccess && <span style={{ color: 'green', marginLeft: 12 }}>Submitted!</span>}
                {submitError && <span style={{ color: 'red', marginLeft: 12 }}>{submitError}</span>}
            </form>
        </div>
    );
};

export default StudentExamDetail;
