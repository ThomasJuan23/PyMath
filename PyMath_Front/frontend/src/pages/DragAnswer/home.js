import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button, Form, Select } from 'antd';
import axios from 'axios';
import { Base64 } from 'js-base64';
import './home.css';
import m1 from '../../assets/images/mouse1.cur';
import m2 from '../../assets/images/mouse2.cur';
import m3 from '../../assets/images/mouse3.cur';
import m4 from '../../assets/images/mouse4.cur';
import m5 from '../../assets/images/mouse5.cur';
import { useHistory } from 'react-router-dom';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};
const cursorOptions = [
    { label: 'people', value: m1 },
    { label: 'mushroom', value: m2 },
    { label: 'chicken', value: m3 },
    { label: 'Big Hand', value: m4 },
    { label: 'Monster', value: m5 },
  ];

const initialItems = ['applePrice = 1 ;', 'bananaPrice = 10086;', 'print("the total price is "+ applePrice + bananaPrice)'].map((item, index) => ({
  id: `item-${index}`,
  content: item,
}));

const Home = () => {
  const history = useHistory();
  const [items, setItems] = useState(initialItems);
  const [output, setOutput] = useState('');
  const [cursor, setCursor] = useState(cursorOptions[0].value);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const itemsClone = reorder(items, result.source.index, result.destination.index);
    setItems(itemsClone);
  };

  const handleFormSubmit = async () => {
    try {
      const code = items.map(item => item.content).join('\n');
      const encodedCode = Base64.encode(code);
      const options1 = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: {
          base64_encoded: 'true',
          fields: '*'
        },
        headers: {
          'content-type': 'application/json',
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': '0587ce0408msh08968b209325ec6p1219bbjsn9162c118313a',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        data: {
          language_id: 71,
          source_code: encodedCode
        }
      };
  
      const response = await axios.request(options1);
      console.log(response.data);
      const submissionId = response.data.token;
  
      const fetchResult = async () => {
        try {
          const options2 = {
            method: 'GET',
            url: `https://judge0-ce.p.rapidapi.com/submissions/${submissionId}`,
            params: {
              base64_encoded: 'true',
              fields: '*'
            },
            headers: {
              'X-RapidAPI-Key': '0587ce0408msh08968b209325ec6p1219bbjsn9162c118313a',
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
          };
  
          const result = await axios.request(options2);
          console.log(result.data);
          const { status_id, stdout, stderr } = result.data;
  
          if (status_id === 1 || status_id === 2) {
            setTimeout(fetchResult, 1000);
          } else {
            if (stdout) {
              const decodedOutput = Base64.decode(stdout);
              setOutput(decodedOutput);
            } else if (stderr) {
              const decodedError = Base64.decode(stderr);
              setOutput(decodedError);
            } else {
              setOutput('No output available.');
            }
          }
        } catch (error) {
          console.error(error);
          setOutput('Failed to fetch result.');
        }
      };
  
      setTimeout(fetchResult, 1000);
    
    } catch (error) {
      console.error(error);
      setOutput('Failed to execute Python code.');
    }
  };

  function getItemStyle(isDragging, draggableStyle) {
    return {
      cursor: `url(${cursor}), auto`,
      userSelect: 'none',
      padding: '8px',
      margin: '0 0 8px 0',
      minHeight: '50px',
      backgroundColor: isDragging ? 'lightgreen' : 'white',
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: isDragging ? 'lightgreen' : 'lightblue',
      ...draggableStyle,
    };
  }


  return (
    <div className="container" style={{ position: 'relative' }}>
    <button 
         onClick={() => history.replace('/useradmin/answerexample')}
         style={{
             position: 'absolute',
             top: '10px',
             right: '10px',
             backgroundColor: 'lightblue',
             border: 'none',
             borderRadius: '5px',
             padding: '10px 15px',
             cursor: 'pointer',
             zIndex: 10001 // 确保它在Joyride覆盖层的上方
         }}
     >
         Next
     </button>
      <h1>My Answer</h1>
  
      <Form onFinish={handleFormSubmit} style={{ width: '400px', margin: '0 auto' }}>
        <Form.Item label="Question">
          <div style={{ marginBottom: '10px' }}>Example Question: You want to purchase an apple and a banana in a shop, the apple is 1$, and the banana is 2$, please calculate how much should you pay</div>
        </Form.Item>
        <Form.Item label="Cursor Style">
          <Select 
            defaultValue={cursorOptions[0].label} 
            onChange={(value) => setCursor(value)}
          >
            {cursorOptions.map(({label, value}) => (
              <Select.Option key={value} value={value}>{label}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Answer">
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ padding: '10px', width: '250px', minHeight: '300px', border: '1px solid #000', margin: '0 auto' }}
                >
                  {items.map(({id, content}, index) => (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          {content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Form.Item>
        <Form.Item style={{ textAlign: 'center' }}>
          <Button type="primary" htmlType="submit" >Submit</Button>
        </Form.Item>
      </Form>
  
      <div>
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
  
}

export default Home;

