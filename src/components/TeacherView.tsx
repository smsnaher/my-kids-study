
import React, { useState } from "react";
import { CreateExam } from "./tabs/CreateExam";

export const TeacherView: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const tabs = [
        { label: "Create Exam", content: <><CreateExam /></> },
        { label: "Tab 2", content: <><h3>Tab 2 Content</h3><p>This is the content for Tab 2.</p></> },
        { label: "Tab 3", content: <><h3>Tab 3 Content</h3><p>This is the content for Tab 3.</p></> },
    ];

    return (
        <div>
            <h2>👨‍🏫 Teacher View</h2>
            <p>This is the teacher view content.</p>
            <div className="tab-container">
                {tabs.map((tab, idx) => (
                    <button
                        key={tab.label}
                        className={`tab-button${activeTab === idx ? " active" : ""}`}
                        onClick={() => setActiveTab(idx)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="tab-content">
                {tabs.map((tab, idx) => (
                    <div
                        key={tab.label}
                        className={`tab-panel${activeTab === idx ? " active" : ""}`}
                        style={{ display: activeTab === idx ? "block" : "none" }}
                    >
                        {tab.content}
                    </div>
                ))}
            </div>
        </div>
    );
};
