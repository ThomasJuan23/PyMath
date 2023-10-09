import React, { useState, useEffect } from 'react';
import { Breadcrumb, Layout, Menu, Button, Form, Input, message, Modal } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import storageUtils from '../../utils/storageUtils';
import { runCode, getQuestions, provideAnswer, deleteMessagesByQuestionId } from '../../api';
import { useHistory } from 'react-router-dom';
//set the stype of button
const buttonStyle = {
  backgroundColor: 'white',
  color: '#60A3D9',
  borderColor: '#B2DFEE',
  marginRight: '10px'
};

const Home = () => {

  const history = useHistory()
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [question, setQuestion] = useState([]);
  const [level, setLevel] = useState("");
  const [password, setPassword] = useState("");
  const [explain, setExplain] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const codeLineCount = code.split('\n').length;
  // password verification modal
  const showModal = () => {
    setIsModalVisible(true);
  };
  //add the answer request
  const handleOk = async () => {
    setIsModalVisible(false);
    const data = await provideAnswer(storageUtils.getQuestion(), code, storageUtils.getUser(), password, explain);
    if (data.code === 200) {
      const result = await deleteMessagesByQuestionId(storageUtils.getQuestion());
      if(result.code === 200){
        message.success(data.message);
        history.replace('/admin/adminhome');
      }else{
        message.error(result.message);
      }
     
    }
    else {
      message.error(data.message);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Fetch questions and level when component mounts
  useEffect(() => {
    fetchQuestions();
  }, []);
  //test the code
  const handleFormSubmit = async () => {
    const result = await runCode(code);
    if (result.code === 200) {
      message.success("run successfully");
      setOutput(result.data);
    } else {
      message.error(result.message);
    }
  };

  const handleSave = async () => {
    const data = await provideAnswer(storageUtils.getQuestion(), code, storageUtils.getUser(), password, explain);
    if (data.code === 200) {
      message.success(data.message);
      history.replace('/admin/adminhome')
    }
    else {
      message.error(data.message);
    }
    // handle response from provideAnswer
  }
  // get the questions
  const fetchQuestions = async () => {
    const data = await getQuestions(1, storageUtils.getQuestion(), null, null, null, null, null, null, null);
    if (data.code === 200) {
      if (data.data.records) {
        setQuestion(data.data.records[0].question);
        setLevel(data.data.records[0].level);
      }
    } else {
      message.error(data.message);
    }
  };

  return (
    <div className="site-layout-background" style={{
      padding: 24,
      minHeight: 600,
      fontSize: '30px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1>The Answer</h1>
      <Form onFinish={handleFormSubmit} style={{ width: '400px' }}>
        <Form.Item label="Question">
          <div>{question}</div>
        </Form.Item>
        <Form.Item label="Level">
          <div>{level}</div>
        </Form.Item>
        <Form.Item label="Answer">
          {/* IDE Editor */}
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
        {/* Explain Editor */}
        <Form.Item
          name="explain"
          label="Explain"
          tooltip="If the question's level is 1, you must add an explanation. Explain your code line by line; one line of code corresponds to one line of explanation."
          rules={[
            {
              required: level === "1",
              message: 'Explanation is required for level 1 questions.',
            },
          ]}
        > 
        {/* control the line of the explain editor is the same as code */}
          <Input.TextArea
            rows={codeLineCount}
            onChange={(e) => setExplain(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button style={buttonStyle} onClick={handleFormSubmit}>Test</Button>
            <Button style={{ ...buttonStyle, marginRight: 0 }} onClick={showModal}>Save Answer</Button>
          </div>
        </Form.Item>

        <Modal title="Enter Password" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <Input.Password
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Modal>
      </Form>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h3 style={{ marginRight: '10px', fontSize: '16px' }}>Output:</h3>
        <pre style={{ whiteSpace: 'nowrap', overflow: 'auto', margin: 0, fontSize: '16px' }}>{output}</pre>
      </div>
    </div>
  );
}

export default Home;
