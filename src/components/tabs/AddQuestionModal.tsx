import React from 'react';
import SumQuestion from '../questions/SumQuestion';
import SubtractionQuestion from '../questions/SubtractionQuestion';
import styles from './ExamDetail.module.css';

interface AddQuestionModalProps {
  question: string;
  setQuestion: (q: string) => void;
  saving: boolean;
  error: string | null;
  success: boolean;
  onClose: () => void;
  onSubmit: () => void;
  sumNumbers: string[];
  setSumNumbers: (nums: string[]) => void;
  onAddType: () => void;
}

const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
  question,
  setQuestion,
  saving,
  error,
  success,
  onClose,
  onSubmit,
  sumNumbers,
  setSumNumbers,
  onAddType
}) => (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>

    




      <div className={styles.modalHeader}>
        <h3 style={{ marginTop: 0 }}>Question Group</h3>
        <button onClick={onClose} className={styles.closeBtn}>&times;</button>
      </div>

      <form style={{ marginBottom: 24 }} onSubmit={e => { e.preventDefault(); onAddType(); }}>
        <input type="text" placeholder="Question Type" value={question} onChange={e => setQuestion(e.target.value)} />
        <input type="text" placeholder="Marks" value={question} onChange={e => setQuestion(e.target.value)} />
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>

      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <h3 style={{ marginTop: 0 }}>Add Question</h3>
        <select value={question} onChange={e => setQuestion(e.target.value)} className={styles.select}>
          <option value="">Select a question</option>
          <option value="sum">Sum</option>
          <option value="subtraction">Subtraction</option>
        </select>
        {question === 'sum' && <SumQuestion numbers={sumNumbers} setNumbers={setSumNumbers} />}
        {question === 'subtraction' && <SubtractionQuestion />}
        <div className={styles.actions}>
          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Add Question'}
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Question added!</div>}
      </form>
    </div>
  </div>
);

export default AddQuestionModal;
