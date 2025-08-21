
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
  const [showForm, setShowForm] = useState(false);

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
      setShowForm(false);
    } catch {
      setError('Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='exam-detail' style={{ background: '#fff', minHeight: '100%', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 16 }}>
        <button onClick={onClose} style={{ background: '#eee', border: 'none', borderRadius: 4, padding: '6px 18px', cursor: 'pointer' }}>← Back to Dashboard</button>
        <h2 style={{ margin: 0, flex: 1 }}>Exam: {exam.name}</h2>
        <button
          style={{ background: '#0077ff', color: '#fff', border: 'none', borderRadius: 5, padding: '0.7rem 1.5rem', fontSize: '1rem', cursor: 'pointer' }}
          onClick={() => setShowForm(true)}
        >
          Add Question
        </button>
      </div>

      {/* Modal for adding question */}
      {showForm && (
        <div style={{
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 10, minWidth: 350, boxShadow: '0 2px 16px #0002', position: 'relative' }}>
            <button onClick={() => { setShowForm(false); setError(null); setQuestion(''); }} style={{ position: 'absolute', top: 10, right: 10, background: 'transparent', border: 'none', fontSize: 22, cursor: 'pointer' }}>&times;</button>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleAddQuestion();
              }}
            >
              <h3 style={{ marginTop: 0 }}>Add Question</h3>
              <input
                type="text"
                placeholder="Enter question"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                style={{ padding: '0.6rem 1rem', border: '1px solid #ccc', borderRadius: 6, fontSize: '1rem', marginRight: 8, width: 320 }}
              />
              <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                <button type="submit" disabled={saving} style={{ padding: '0.5rem 1.2rem', border: 'none', borderRadius: 5, background: '#0077ff', color: '#fff', fontSize: '1rem', cursor: 'pointer' }}>
                  {saving ? 'Saving...' : 'Add Question'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setError(null); setQuestion(''); }} style={{ padding: '0.5rem 1.2rem', border: 'none', borderRadius: 5, background: '#bbb', color: '#222', fontSize: '1rem', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
              {error && <div style={{ color: '#d32f2f', background: '#ffeaea', borderRadius: 4, padding: '0.3rem 0.7rem', fontSize: '0.97rem', marginTop: 10 }}>{error}</div>}
              {success && <div style={{ color: '#388e3c', background: '#eaffea', borderRadius: 4, padding: '0.3rem 0.7rem', fontSize: '0.97rem', marginTop: 10 }}>Question added!</div>}
            </form>
          </div>
        </div>
      )}

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
