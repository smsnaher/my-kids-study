import React, { useState, useEffect } from 'react';
import styles from './CreateExam.module.css';
import { db } from '../../firebase/config';
import { collection, addDoc, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { ExamModal } from './ExamModal';
import { useAuth } from '../../hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';

interface Exam {
    id: string;
    name: string;
    userId: string;
    createdAt: any;
    docId: string;
}




export const CreateExam: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [examName, setExamName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [exams, setExams] = useState<Exam[]>([]);
    const [listLoading, setListLoading] = useState(false);
    const { currentUser } = useAuth();

    // Close modal and reset state
    const handleClose = () => {
        setModalOpen(false);
        setExamName('');
        setError(null);
        setSuccess(false);
    };

    const handleOpen = () => {
        setModalOpen(true);
        setExamName('');
        setError(null);
        setSuccess(false);
    };

    // Fetch exams for the current user
    const fetchExams = async () => {
        if (!currentUser) {
            setExams([]);
            return;
        }
        setListLoading(true);
        try {
            const q = query(
                collection(db, 'examinations'),
                where('userId', '==', currentUser.uid),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const docsData: Exam[] = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: data.id,
                    name: data.name,
                    userId: data.userId,
                    createdAt: data.createdAt,
                    docId: doc.id,
                };
            });
            setExams(docsData);
        } catch {
            setExams([]);
        } finally {
            setListLoading(false);
        }
    };

    // useEffect(() => {
    //     console.log(exams);
    // }, [exams]);

    useEffect(() => {
        fetchExams();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    const handleSave = async () => {
        if (!examName.trim()) {
            setError('Exam Name is required');
            return;
        }
        if (!currentUser) {
            setError('User not authenticated');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const examId = uuidv4();
            await addDoc(collection(db, 'examinations'), {
                id: examId,
                name: examName,
                userId: currentUser.uid,
                createdAt: new Date(),
            });
            setSuccess(true);
            await fetchExams(); // Refresh list after save
            setTimeout(() => {
                handleClose();
            }, 1000);
        } catch {
            setError('Failed to create exam');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className={styles.heading}>
                <h2>Create Exam</h2>
                <button onClick={handleOpen}>Create Exam</button>
            </div>
            {modalOpen && (
                <ExamModal
                    examName={examName}
                    onExamNameChange={e => setExamName(e.target.value)}
                    onSave={handleSave}
                    onClose={handleClose}
                    loading={loading}
                    error={error}
                    success={success}
                    styles={styles}
                />
            )}
            <div className={styles.examList} style={{ marginTop: 32 }}>
                <h3>Your Exams</h3>
                {listLoading ? (
                    <div>Loading...</div>
                ) : exams.length === 0 ? (
                    <div>No exams found.</div>
                ) : (
                    <ul>
                        {exams.map(exam => (
                            <li key={exam.id || exam.docId} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <strong>{exam.name}</strong> <span style={{ color: '#888', fontSize: 12 }}>({exam.id})</span>
                                <button
                                    style={{ marginLeft: 8, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 10px', cursor: 'pointer' }}
                                    onClick={async () => {
                                        if (window.confirm('Are you sure you want to delete this exam?')) {
                                            await deleteDoc(doc(db, 'examinations', exam.docId));
                                            await fetchExams();
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};