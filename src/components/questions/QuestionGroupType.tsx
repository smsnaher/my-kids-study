
import React, { useState } from 'react';

interface QuestionTypeGroupProps {
    saving: boolean;
    onAddType: (type: string, mark: string) => void;
}


export const QuestionGroupType: React.FC<QuestionTypeGroupProps> = ({ saving, onAddType }) => {
    const [type, setType] = useState('');
    const [mark, setMark] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddType(type, mark);
        setType('');
        setMark('');
    };

    return (
        <form style={{ marginBottom: 24 }} onSubmit={handleSubmit}>
            <input type="text" placeholder="Question Type" value={type} onChange={e => setType(e.target.value)} />
            <input type="text" placeholder="Marks" value={mark} onChange={e => setMark(e.target.value)} />
            <button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
            </button>
        </form>
    );
};
