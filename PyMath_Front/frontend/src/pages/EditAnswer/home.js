import React, { useState, useEffect } from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import storageUtils from '../../utils/storageUtils';
import { runCode, getQuestions, editAnswer } from '../../api';
import { useHistory } from 'react-router-dom';

const buttonStyle = {
  backgroundColor: 'white',
  color: '#60A3D9',
  borderColor: '#B2DFEE',
  marginRight: '10px'
};

const Home = () => {

  const history = useHistory()
  const [form] = Form.useForm(); // 获取 form 实例
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [question, setQuestion] = useState([]);
  const [level, setLevel] = useState("");
  const [password, setPassword] = useState("");
  const [explain, setExplain] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const codeLineCount = code.split('\n').length;

  // ... (the rest of your useEffects and functions)

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    const data = await editAnswer(storageUtils.getQuestion(), code, storageUtils.getUser(), password, explain);
    if (data.code === 200) {
      message.success(data.message);
      history.replace('/admin/adminhome');
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

  const handleFormSubmit = async () => {
    const result = await runCode(code);
    if (result.code === 200) {
      message.success("run successfully");
      setOutput(result.data);
    } else {
      message.error(result.message);
    }
  };

  const fetchQuestions = async () => {
    const data = await getQuestions(1, storageUtils.getQuestion(), null, null, null, null, null, null, null);
    if (data.code === 200) {
      if (data.data.records) {
        setQuestion(data.data.records[0].question);
        setLevel(data.data.records[0].level);
        setCode(data.data.records[0].answer)
        setExplain(data.data.records[0].answerExplain)
        form.setFieldsValue({
          explain:data.data.records[0].answerExplain,
        });
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
      <Form form={form} style={{ width: '400px' }}>
        <Form.Item label="Question">
          <div>{question}</div>
        </Form.Item>
        <Form.Item label="Level">
          <div>{level}</div>
        </Form.Item>
        <Form.Item label="Answer">
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
          <Input.TextArea
            rows={codeLineCount}
            onChange={(e) => {
              console.log("New value: ", e.target.value);
              setExplain(e.target.value);
          }}
           
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
