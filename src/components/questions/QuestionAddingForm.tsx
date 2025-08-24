import SumQuestion from '../questions/SumQuestion';
import SubtractionQuestion from '../questions/SubtractionQuestion';
import styles from '../tabs/ExamDetail.module.css';

type QuestionAddingFormProps = {
    question: string;
    setQuestion: (value: string) => void;
    saving: boolean;
    error?: string;
    success?: boolean;
    onClose: () => void;
    onSubmit: () => void;
    sumNumbers: number[];
    setSumNumbers: (numbers: number[]) => void;
};

export const QuestionAddingForm: React.FC<QuestionAddingFormProps> = ({
    question,
    setQuestion,
    saving,
    error,
    success,
    onClose,
    onSubmit,
    sumNumbers,
    setSumNumbers
}) => (
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
        {question === 'sum' && (
            <SumQuestion
                numbers={sumNumbers.map(String)}
                setNumbers={(nums: string[]) => setSumNumbers(nums.map(Number))}
            />
        )}
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
);
