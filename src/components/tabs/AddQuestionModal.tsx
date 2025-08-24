import React from 'react';
import styles from './ExamDetail.module.css';
import { QuestionGroupType } from '../questions/QuestionGroupType';
import { QuestionAddingForm } from '../questions/QuestionAddingForm';

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

      <QuestionGroupType
        question={question}
        setQuestion={setQuestion}
        saving={saving}
        onAddType={onAddType}
      />

      <QuestionAddingForm
        question={question}
        setQuestion={setQuestion}
        saving={saving}
        error={error ?? undefined}
        success={success}
        onClose={onClose}
        onSubmit={onSubmit}
        sumNumbers={sumNumbers.map(Number)}
        setSumNumbers={(nums: number[]) => setSumNumbers(nums.map(String))}
      />
    </div>
  </div>
);

export default AddQuestionModal;
