import React from 'react';

interface ExamModalProps {
  examName: string;
  onExamNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onClose: () => void;
  loading: boolean;
  error: string | null;
  success: boolean;
  styles: { [key: string]: string };
}

export const ExamModal: React.FC<ExamModalProps> = ({
  examName,
  onExamNameChange,
  onSave,
  onClose,
  loading,
  error,
  success,
  styles,
}) => (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <h3>New Exam</h3>
      <input
        type="text"
        placeholder="Exam Name"
        value={examName}
        onChange={onExamNameChange}
        className={styles.input}
      />
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>Exam created!</div>}
      <div className={styles.actions}>
        <button onClick={onSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button onClick={onClose} disabled={loading}>Cancel</button>
      </div>
    </div>
  </div>
);
