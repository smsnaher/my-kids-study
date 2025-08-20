
import React, { useState } from 'react';

interface ExamDetailProps {
  exam: {
    id: string;
    name: string;
    userId: string;
    createdAt: any;
    docId: string;
  };
  onClose: () => void;
}

export const ExamDetail: React.FC<ExamDetailProps> = ({ exam, onClose }) => {
  const [question, setQuestion] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAddQuestion = async () => {
    if (!question.trim()) {
      setError('Question is required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      // TODO: Save question to Firestore under this exam
      setQuestions(prev => [...prev, question]);
      setSuccess(true);
      setQuestion('');
      setTimeout(() => setSuccess(false), 1200);
    } catch {
      setError('Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='exam-detail' style={{ background: '#fff', minHeight: '100%', width: '100%' }}>
      <button onClick={onClose} style={{ marginBottom: 16, background: '#eee', border: 'none', borderRadius: 4, padding: '6px 18px', cursor: 'pointer' }}>← Back to Dashboard</button>
      <h2 style={{ marginBottom: 8 }}>Exam: {exam.name}</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleAddQuestion();
        }}
        style={{ marginBottom: 24 }}
      >
        <input
          type="text"
          placeholder="Enter question"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          style={{ padding: '0.6rem 1rem', border: '1px solid #ccc', borderRadius: 6, fontSize: '1rem', marginRight: 8, width: 320 }}
        />
        <button type="submit" disabled={saving} style={{ padding: '0.5rem 1.2rem', border: 'none', borderRadius: 5, background: '#0077ff', color: '#fff', fontSize: '1rem', cursor: 'pointer' }}>
          {saving ? 'Saving...' : 'Add Question'}
        </button>
      </form>
      {error && <div style={{ color: '#d32f2f', background: '#ffeaea', borderRadius: 4, padding: '0.3rem 0.7rem', fontSize: '0.97rem', marginBottom: 8 }}>{error}</div>}
      {success && <div style={{ color: '#388e3c', background: '#eaffea', borderRadius: 4, padding: '0.3rem 0.7rem', fontSize: '0.97rem', marginBottom: 8 }}>Question added!</div>}
      <h3>Questions</h3>
      {questions.length === 0 ? (
        <div style={{ color: '#888' }}>No questions added yet.</div>
      ) : (
        <ul>
          {questions.map((q, idx) => (
            <li key={idx} style={{ marginBottom: 6 }}>{q}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
