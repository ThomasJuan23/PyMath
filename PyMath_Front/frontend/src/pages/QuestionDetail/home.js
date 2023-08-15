import React from 'react';
import { useHistory } from 'react-router-dom';

export default function QuestionDetail() {
    const history = useHistory();
    const question = {
        id: '123',
        questionContent: 'What is the capital of France?',
        answer: 'Paris',
        dragAnswer: 'P_ar_is',
        type: 'Geography',
        ageGroup: '10-12 years',
        createTime: '2023-08-01 10:30:45',
        changeTime: '2023-08-02 11:15:30',
        edition: 'v1.2',
        creatorName: 'Jane Smith'
    };

    return (
        <div style={{ padding: 24, maxWidth: 600, margin: '0 auto', textAlign: 'center', position:'relative' }}>
            <h1>Question Details</h1>

            <button 
                onClick={() => history.goBack()}
                style={{ 
                    position: 'absolute', 
                    top: '24px', 
                    right: '24px', 
                    backgroundColor: 'lightblue', 
                    border: 'none', 
                    borderRadius: '8px', 
                    padding: '8px 16px',
                    cursor: 'pointer'
                }}
            >
                Back
            </button>

            <div style={{ padding: '16px 0' }}>
                <strong>ID:</strong> {question.id}
            </div>
            <div style={{ padding: '16px 0' }}>
                <strong>Content:</strong> {question.questionContent}
            </div>
            <div style={{ padding: '16px 0' }}>
                <strong>Answer:</strong> {question.answer}
            </div>
            <div style={{ padding: '16px 0' }}>
                <strong>Drag Answer:</strong> {question.dragAnswer}
            </div>
            <div style={{ padding: '16px 0' }}>
                <strong>Type:</strong> {question.type}
            </div>
            <div style={{ padding: '16px 0' }}>
                <strong>Age Group:</strong> {question.ageGroup}
            </div>
            <div style={{ padding: '16px 0' }}>
                <strong>Create Time:</strong> {question.createTime}
            </div>
            <div style={{ padding: '16px 0' }}>
                <strong>Change Time:</strong> {question.changeTime}
            </div>
            <div style={{ padding: '16px 0' }}>
                <strong>Edition:</strong> {question.edition}
            </div>
            <div style={{ padding: '16px 0' }}>
                <strong>Creator Name:</strong> {question.creatorName}
            </div>
        </div>
    );
}
