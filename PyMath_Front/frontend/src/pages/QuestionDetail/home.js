import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import storageUtils from '../../utils/storageUtils';
import { getQuestions, getUserList } from '../../api';
import {message, Button } from 'antd';

export default function QuestionDetail() {
    const history = useHistory();
    const [question, setQuestion] = useState([]);
    const [userName, setUserName] = useState("");

    const handleBack = () => {
        history.replace('/teacheradmin/teacherhome');
      };

    useEffect(() => {
        const fetchQuestionAndUser = async () => {
            const id = storageUtils.getQuestion();
            const questionData = await getQuestions(1, id);
            
            if (questionData.code === 200) {
                const fetchedQuestion = questionData.data.records[0];
                setQuestion(fetchedQuestion);
                const userData = await getUserList(1,null,null,fetchedQuestion.email,null);
                console.log("Sads是"+userData.data.records[0].realName);
                if (userData.code === 200) {
                    setUserName(userData.data.records[0].realName);
                }else{
                    message.error(userData.message);
                }
            }
            else{
                message.error(questionData.message);
            }
        };

        fetchQuestionAndUser();
    }, []);

    return (
        <div style={{ padding: 24, maxWidth: 600, margin: '0 auto', textAlign: 'center', position:'relative' }}>
            <h1>Question Details</h1>

            <Button
                onClick={handleBack}
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: 'lightblue',
                    border: 'none',
                    borderRadius: '5px',
                    color: 'white',
                }}
            >
                Back
            </Button>
            {question.id && <div style={{ padding: '16px 0' }}><strong>ID:</strong> {question.id}</div>}
            {question.question && <div style={{ padding: '16px 0' }}><strong>Content:</strong> {question.question}</div>}
            {question.answer && <div style={{ padding: '16px 0' }}><strong>Answer:</strong> {question.answer}</div>}
            {question.answerExplain && <div style={{ padding: '16px 0' }}><strong>Explain:</strong> {question.answerExplain}</div>}
            {question.type && <div style={{ padding: '16px 0' }}><strong>Type:</strong> {question.type}</div>}
            {question.ageGroup && <div style={{ padding: '16px 0' }}><strong>Age Group:</strong> {question.ageGroup}</div>}
            {question.level && <div style={{ padding: '16px 0' }}><strong>Level:</strong> {question.level}</div>}
            {userName && <div style={{ padding: '16px 0' }}><strong>Creator Name:</strong> {userName}</div>}
            {question.email && <div style={{ padding: '16px 0' }}><strong>Creator Email:</strong> {question.email}</div>}
            {question.createTime && <div style={{ padding: '16px 0' }}><strong>Create Time:</strong> {question.createTime}</div>}
            {question.changeTime && <div style={{ padding: '16px 0' }}><strong>Change Time:</strong> {question.changeTime}</div>}
            {question.edition && <div style={{ padding: '16px 0' }}><strong>Edition:</strong> {question.edition}</div>}
        </div>
    );
}
