import SumQuestion from '../questions/SumQuestion';
import SubtractionQuestion from '../questions/SubtractionQuestion';
import styles from '../tabs/ExamDetail.module.css';
import { fetchAllGroupTypes } from '../../data/groupTypeService';

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

import React, { useEffect, useState } from 'react';

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
}) => {
    const [groupTypes, setGroupTypes] = useState<{ id: string; type: string; mark: string }[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string>('');

    useEffect(() => {
        // Replace this with your actual fetchAllGroupTypes API call
        async function fetchGroupTypes() {
            // Fetch data from src/data/groupTypeService.ts
            const data = await fetchAllGroupTypes();
            // Ensure each group type has both id and name
            const groupTypesWithName = data.map((item: any) => ({
                id: item.id,
                type: item.type && item.type,
                mark: item.mark && item.mark
            }));
            setGroupTypes(groupTypesWithName);
        }
        fetchGroupTypes();
    }, []);

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                onSubmit();
            }}
        >
            {/* fetch group types here to make a radio button from fetchAllGroupTypes */}
            <div>
                <h4>Question Group</h4>
                {/* Map through the fetched group types and create a radio button for each */}
                {groupTypes.map(type => (
                    <div key={type.id}>
                        <label>
                            <input
                                type="radio"
                                name="questionGroup"
                                value={type.id}
                                checked={selectedGroup === type.id}
                                onChange={() => setSelectedGroup(type.id)}
                            />
                            {type.type} {type.mark}
                        </label>
                    </div>
                ))}
            </div>

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
    )
};
