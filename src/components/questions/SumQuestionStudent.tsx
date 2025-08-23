import React from 'react';

interface SumQuestionStudentProps {
  question: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SumQuestionStudent: React.FC<SumQuestionStudentProps> = ({ question, value, onChange }) => (
  <div>
    <div>{question}</div>
    <input
      type="text"
      value={value}
      onChange={onChange}
      style={{ marginTop: 4, padding: '4px 8px', fontSize: 15 }}
      placeholder="Your answer"
    />
  </div>
);

export default SumQuestionStudent;
