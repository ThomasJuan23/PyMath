import React, { useEffect, useState } from 'react';
import {  Button, Form, Input, Select, Tooltip, message } from 'antd';
import { QuestionCircleOutlined, PlusOutlined } from '@ant-design/icons';
import storageUtils from '../../utils/storageUtils';
import { addQuestion, getDistinctTypes, getQuestions, getUserList, submitQuestion } from '../../api';
import { useHistory} from 'react-router-dom';

const { Option } = Select;



export default function Home() {
  const history = useHistory()

  const [types, setTypes] = useState([]);
  const [customTypes, setCustomTypes] = useState([]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await getDistinctTypes();
        if (response.code === 200) {
          setTypes(response.data); 
        }
      } catch (error) {
        message.error('Failed to fetch types.');
      }
    };

    fetchTypes();
  }, []);


  const handleFormSubmit = async(values) => {
    //  all cutom types
    const customTypeKeys = Object.keys(values).filter(key => key.startsWith('customType'));

    // last one is the actual type
    let finalType = values.type;
    if (customTypeKeys.length > 0) {
      finalType = values[customTypeKeys[customTypeKeys.length - 1]];
    }

    const { question, level } = values;
    const email = storageUtils.getUser();  

    try {
      const userData = await getUserList(1,null,null,email,null);  //get the age group
      if (userData.code === 200) {  //add question request
        const response = await addQuestion(question, level, finalType, userData.data.records[0].ageGroup, email);
      if (response.code === 200) { 
        message.success('Question successfully added!');
        history.replace('/teacheradmin/teacherhome')
      } else {
        message.error(`Failed to add question: ${response.message}`);  
      }
     }else{
        message.error(userData.message);
     }

    } catch (error) {
      console.log(error);
      message.error("An error occurred");
    }
};

const handleBack = () => {
  history.replace('/teacheradmin/teacherhome');
};

  const addCustomType = () => {
    setCustomTypes([...customTypes, { type: '' }]);
  };

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
      <h1>PyMath</h1>
      <Form onFinish={handleFormSubmit} style={{ width: '400px' }}>
        <Form.Item name="question" label="Question">
          <Input.TextArea rows={4} />
        </Form.Item>
        {/* get type according to the database */}
        <Form.Item name="type" label="Type">
          <Select style={{ width: '100%' }}>
            {types.map((type, index) => (
              <Option key={index} value={type}>{type}</Option>
            ))}
          </Select>
        </Form.Item>
      {/* new type */}
        <Button type="dashed" onClick={addCustomType} style={{ width: '100%', marginBottom: '16px' }}>
          <PlusOutlined /> Add More Type
        </Button>
        {customTypes.map((_, index) => (
          <Form.Item key={index} name={`customType${index}`} label={`Custom Type ${index + 1}`}>
            <Input />
          </Form.Item>
        ))}
        
        <Form.Item name="level" label="Level">
  <Select style={{ width: '100%' }}>
    <Option value="1">1 <Tooltip title="Serves as the only example of this type"><QuestionCircleOutlined /></Tooltip></Option>
    <Option value="2">2 <Tooltip title="Simple simulation of the example"><QuestionCircleOutlined /></Tooltip></Option>
    <Option value="3">3 <Tooltip title="Transitions the example to a practical problem"><QuestionCircleOutlined /></Tooltip></Option>
    <Option value="4">4 <Tooltip title="Represents a real-world problem"><QuestionCircleOutlined /></Tooltip></Option>
  </Select>
</Form.Item>
<Form.Item style={{ textAlign: 'center' }}>  {/* center the submit button */}
          <Button type="primary" htmlType="submit" style={{ backgroundColor: 'white', borderColor: '#1890ff', color: '#1890ff' }}>Submit</Button>  {/* 设置按钮的背景颜色为白色 */}
        </Form.Item>
      </Form>
    </div>
  );
}
