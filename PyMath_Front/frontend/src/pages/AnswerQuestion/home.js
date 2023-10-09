import React, { useState, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { Button, Form, Select, message } from 'antd';
import storageUtils from '../../utils/storageUtils';
import { addHistory, getQuestions, verifyAnswer, getAfterQuestion, getBeforeQuestion } from '../../api';
import { useHistory } from 'react-router-dom';

const Home = () => {
  const history = useHistory();
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [run, setRun] = useState(true);
  const [question, setQuestion] = useState('');
  const [type, setType] = useState('');
  const [previous, setPrevious] = useState('');
  const [next, setNext] = useState('');

  useEffect(() => {
  
    fetchQuestion();
  }, []);
//get question
  const fetchQuestion = async () => {
    try {
      const result = await getQuestions(1, storageUtils.getQuestion(), null, null, null, null, null, null, null);
      if (result.code === 200) {
        setQuestion(result.data.records[0].question);
        setType(result.data.records[0].type);
        const nextdata = await getAfterQuestion(storageUtils.getUser(),storageUtils.getQuestion());
        if(nextdata.code === 200){
          setNext(nextdata.data);
        }else{
          message.error(nextdata.message);
        }
        const previousdata = await getBeforeQuestion(storageUtils.getUser(),storageUtils.getQuestion());
        if(previousdata.code === 200){
          setPrevious(previous.data);
        }else{
          message.error(previousdata.message);
        }
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };


  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // click skip or done , finish
      setRun(false);
    }
  };



//verify the answer
const handleFormSubmit = async () => {
  const userAnswer = code;
  const result = await verifyAnswer(userAnswer, storageUtils.getQuestion());

  if (result.code === 200) {
    message.success(result.message);
    setOutput(result.data);
    //add the history record
    const data = await addHistory(storageUtils.getUser(),storageUtils.getQuestion(),userAnswer,result.message+result.data,type);
    if(data.code === 200){
      handleNext();
    }
  } else {
    message.error(result.message);
    setOutput(result.data);
    const data = await addHistory(storageUtils.getUser(),storageUtils.getQuestion(),userAnswer,result.message+result.data,type);
  }
};

const handleNext = async() =>{
  //get teh next question
  const nextdata = await getAfterQuestion(storageUtils.getUser(),storageUtils.getQuestion());
  if(nextdata.code === 200){
    const questionId = nextdata.data;
    if(questionId=="last one"){
      message.error("This is the last question")
    }
    const result = await getQuestions(1, questionId, null, null, null, null, null, null, null);
    if (result.code === 200) {
      storageUtils.saveQuestion(questionId);  //jump to different page according to the level
      const level = result.data.records[0].level;
      if(level==1)
      history.replace('/useradmin/dragexample')
      if(level==2)
      history.replace('/useradmin/drag')
      if(level==3)
      history.replace('/useradmin/answerexample')
      if(level==4)
      fetchQuestion()
    } else {
      message.error(result.message);
    }
  }else{
    message.error(nextdata.message);
  }

}

const handlePrevious = async() =>{
  const nextdata = await getBeforeQuestion(storageUtils.getUser(),storageUtils.getQuestion());
  if(nextdata.code === 200){
    const questionId = nextdata.data;
    if(questionId=="first one"){
      message.error("This is the first question")
    }else{
    const result = await getQuestions(1, questionId, null, null, null, null, null, null, null);
    if (result.code === 200) {
      storageUtils.saveQuestion(questionId);
      const level = result.data.records[0].level;
      if(level==1)
      history.replace('/useradmin/dragexample')
      if(level==2)
      history.replace('/useradmin/drag')
      if(level==3)
      history.replace('/useradmin/answerexample')
      if(level==4)
      fetchQuestion()
    } else {
      message.error(result.message);
    }}
  }else{
    message.error(nextdata.message);
  }

}
  

  return (
    <div className="site-layout-background" style={{
      padding: 24,
      minHeight: 600,
      fontSize: '30px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position:'relative'
    }}>
     <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
          width: '100%', // full
          position: 'absolute',
          top: 0, 
        }}
      >
        <button
          onClick={handlePrevious}
          style={{
            backgroundColor: 'lightblue',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 15px',
            cursor: 'pointer',
            zIndex: 10001,
          }}
          disabled={previous === "first one"} // unclickable when first
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          style={{
            backgroundColor: 'lightblue',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 15px',
            cursor: 'pointer',
            zIndex: 10001,
          }}
          disabled={next === "last one"} // unclikable when last
        >
          Next
        </button>
        </div>

      <h1>My Answer</h1>

      <Form onFinish={handleFormSubmit} style={{ width: '400px' }}>
        <Form.Item label="Question" className='question-item'>
          <div>{question}</div>
        </Form.Item>
        <Form.Item label="Answer" className='answer-item'>
          <MonacoEditor
            width="100%"
            height="300px"
            language="python"
            theme="hc-black"
            value={code}
            onChange={(value) => {
              setCode(value);
            }}
          />
        </Form.Item>
        <Form.Item style={{textAlign: 'center'}}>
          <Button type="primary" htmlType="submit" className='submit-item'>Submit</Button>
        </Form.Item>
      </Form>

      <div style={{ display: 'flex', alignItems: 'center' }}>
    <h3 style={{ marginRight: '10px', fontSize: '16px' }}>Feedback:</h3>
    <pre style={{ whiteSpace: 'nowrap', overflow: 'auto', margin: 0, fontSize: '16px' }}>{output}</pre>
</div>
    </div>
  );
}

export default Home;
