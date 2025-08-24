interface QuestionTypeGroupProps {
    question: string;
    setQuestion: (value: string) => void;
    saving: boolean;
    onAddType: () => void;
}

export const QuestionGroupType: React.FC<QuestionTypeGroupProps> = ({ question, setQuestion, saving, onAddType }) => (
    <form style={{ marginBottom: 24 }} onSubmit={e => { e.preventDefault(); onAddType(); }}>
        <input type="text" placeholder="Question Type" value={question} onChange={e => setQuestion(e.target.value)} />
        <input type="text" placeholder="Marks" value={question} onChange={e => setQuestion(e.target.value)} />
        <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
        </button>
    </form>
);
