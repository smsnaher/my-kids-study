import React, { useState } from 'react';


interface SumQuestionProps {
  numbers: string[];
  setNumbers: (nums: string[]) => void;
}

const SumQuestion: React.FC<SumQuestionProps> = ({ numbers, setNumbers }) => {
  const handleChange = (idx: number, value: string) => {
    const updated = [...numbers];
    updated[idx] = value;
    setNumbers(updated);
  };

  const handleAddMore = () => {
    setNumbers([...numbers, ""]);
  };

  return (
    <div>
      {numbers.map((num, idx) => (
        <div key={idx} style={{ marginBottom: 8 }}>
          <label>
            Number {idx + 1}:
            <input
              type="number"
              name={`number${idx + 1}`}
              value={num}
              onChange={e => handleChange(idx, e.target.value)}
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>
      ))}
      <button type="button" onClick={handleAddMore} style={{ marginTop: 8 }}>
        Add More
      </button>
    </div>
  );
};

export default SumQuestion;