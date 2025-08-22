
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './ExamDetail.module.css';
import { getExamDetailById } from '../../data/examData';
import type { Exam } from '../../data/examData';
import { saveQuestionToExam, fetchQuestionsByExamId } from '../../data/questionData';
import { sumAdminTemplate } from '../../utils/templates';
import AddQuestionModal from './AddQuestionModal';


// Exam interface imported from examData

export const ExamDetail: React.FC = () => {
    const { id } = useParams();
    const [exam, setExam] = useState<Exam | null>(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [question, setQuestion] = useState('');
    const [questions, setQuestions] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [sumNumbers, setSumNumbers] = useState<string[]>(["", ""]);

    useEffect(() => {
        if (id) {
            getExamDetailById(id, setExam, setLoading, setFetchError);
        }
    }, [id]);

        const handleAddQuestion = async () => {
            if (!question.trim() || !exam) {
                setError('Question is required');
                return;
            }
            setSaving(true);
            setError(null);
            try {
                    if (question === 'sum') {
                        // Convert string inputs to numbers, filter out empty
                        const nums = sumNumbers.map(n => Number(n)).filter(n => !isNaN(n));
                        await saveQuestionToExam(exam.id || exam.docId, question, nums);
                    } else {
                        await saveQuestionToExam(exam.id || exam.docId, question);
                    }
                setSuccess(true);
                setQuestion('');
                setTimeout(() => setSuccess(false), 1200);
                setShowForm(false);
                // Refresh questions from Firestore
                if (exam) {
                    const qs = await fetchQuestionsByExamId(exam.id || exam.docId);
                    setQuestions(qs);
                }
            } catch {
                setError('Failed to save question');
            } finally {
                setSaving(false);
            }
        };

        useEffect(() => {
            // Fetch questions for this exam when exam is loaded
            const fetchQuestions = async () => {
                if (exam) {
                    const qs = await fetchQuestionsByExamId(exam.id || exam.docId);
                    setQuestions(qs);
                }
            };
            fetchQuestions();
        }, [exam]);

        if (loading) return <div>Loading exam...</div>;
        if (fetchError) return <div style={{ color: 'red' }}>{fetchError}</div>;
        if (!exam) return null;

    return (
        <div className={styles.examDetailContainer}>
            <div className={styles.examDetail}>
                <div className={styles.examDetailHeader}>
                    <Link to="/kids-study/" className={styles.closeBtn}>← Back to Dashboard</Link>
                    <button
                        className={styles.modal}
                        style={{ padding: '0.7rem 1.5rem', fontSize: '1rem', cursor: 'pointer', background: '#0077ff', color: '#fff', border: 'none', borderRadius: 5 }}
                        onClick={() => setShowForm(true)}
                    >
                        Add Question
                    </button>
                </div>
                <h2 style={{ margin: 0, flex: 1, fontWeight: 'normal' }}>
                    <strong>Exam Title:</strong>  
                    <u>{exam.name}</u>
                </h2>
            </div>

            {/* Modal for adding question */}
            {showForm && (
                <AddQuestionModal
                    question={question}
                    setQuestion={setQuestion}
                    saving={saving}
                    error={error}
                    success={success}
                    onClose={() => { setShowForm(false); setError(null); setQuestion(''); setSumNumbers(["", ""]); }}
                    onSubmit={handleAddQuestion}
                    sumNumbers={sumNumbers}
                    setSumNumbers={setSumNumbers}
                />
            )}

            <h3>Questions</h3>
            {questions.length === 0 ? (
                <div style={{ color: '#888' }}>No questions added yet.</div>
            ) : (
                <ul>
                    {questions.map((q, idx) => (
                        <li key={idx} style={{ marginBottom: 6 }}>
                          {q.text === 'sum' && Array.isArray(q.data)
                            ? sumAdminTemplate(q.data)
                            : q.text}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
