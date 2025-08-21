import React from 'react';
import styles from './ExamDetail.module.css';

interface AddQuestionModalProps {
  question: string;
  setQuestion: (q: string) => void;
  saving: boolean;
  error: string | null;
  success: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
  question,
  setQuestion,
  saving,
  error,
  success,
  onClose,
  onSubmit,
}) => (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <button onClick={onClose} className={styles.closeBtn}>&times;</button>
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <h3 style={{ marginTop: 0 }}>Add Question</h3>
        <input
          type="text"
          placeholder="Enter question"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          className={styles.input}
        />
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
