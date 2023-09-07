import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button, Form, Select, message } from 'antd';
import storageUtils from '../../utils/storageUtils';
import { addHistory, getQuestions, verifyAnswer, getAfterQuestion, getBeforeQuestion } from '../../api';
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
//all cursor options
const cursorOptions = [
  { label: 'people', value: m1 },
  { label: 'mushroom', value: m2 },
  { label: 'chicken', value: m3 },
  { label: 'Big Hand', value: m4 },
  { label: 'Monster', value: m5 },
];

const Home = () => {
  const history = useHistory();
  const [items, setItems] = useState([]);
  const [output, setOutput] = useState('');
  const [cursor, setCursor] = useState(cursorOptions[0].value);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState([]);
  const [randomizedAnswer, setRandomizedAnswer] = useState([]);
  const [type, setType] = useState('');
  const [previous, setPrevious] = useState('');
  const [next, setNext] = useState('');

  useEffect(() => {
    

    fetchQuestion();
  }, []);
 //get the questions, same as ide answer page
  const fetchQuestion = async () => {
    try {
      const result = await getQuestions(1, storageUtils.getQuestion(), null, null, null, null, null, null, null);
      if (result.code === 200) {
        setQuestion(result.data.records[0].question);
        setAnswer(result.data.records[0].answer.split('\n'));
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
  useEffect(() => {    //spilt the answer 
    const shuffledIndexes = [...Array(answer.length).keys()].sort(() => Math.random() - 0.5);

    const shuffledAnswer = shuffledIndexes.map((index) => answer[index]);
  
    setRandomizedAnswer(shuffledAnswer);
  }, [answer]);

  useEffect(() => {   //split the darg-and-drop items
    const initialItems = randomizedAnswer.map((content, index) => ({
      id: `item-${index}`,
      content: content,
      type: `line${index + 1}`,
    }));
    setItems(initialItems);
  }, [randomizedAnswer]);

   //drop
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const itemsClone = reorder(items, result.source.index, result.destination.index);
    setItems(itemsClone);
  };
  //verify the answer
  const handleFormSubmit = async () => {
    const userAnswer = items.map((item) => item.content).join('\n');
    const result = await verifyAnswer(userAnswer, storageUtils.getQuestion());
  
    if (result.code === 200) {
      message.success(result.message);
      setOutput(result.data);
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
    const nextdata = await getAfterQuestion(storageUtils.getUser(),storageUtils.getQuestion());
    if(nextdata.code === 200){
      const questionId = nextdata.data;
      if(questionId=="last one"){
        message.error("This is the last question")
      }
      const result = await getQuestions(1, questionId, null, null, null, null, null, null, null);
      if (result.code === 200) {
        storageUtils.saveQuestion(questionId);
        const level = result.data.records[0].level;
        if(level==1)
        history.replace('/useradmin/dragexample')
        if(level==2)
        fetchQuestion()
        if(level==3)
        history.replace('/useradmin/answerexample')
        if(level==4)
        history.replace('/useradmin/answer')
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
        fetchQuestion()
        if(level==3)
        history.replace('/useradmin/answerexample')
        if(level==4)
        history.replace('/useradmin/answer')
      } else {
        message.error(result.message);
      }}
    }else{
      message.error(nextdata.message);
    }

  }
  //drag and drop style
  function getItemStyle(isDragging, draggableStyle) {
    return {
      cursor: `url(${cursor}), auto`,
      userSelect: 'none',
      padding: '8px',
      margin: '0 0 8px 0',
      minHeight: '50px',
      backgroundColor: isDragging ?
      'lightgreen' : 'white',
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: isDragging ? 'lightgreen' : 'lightblue',
      ...draggableStyle,
    };
  }

  return (
    <div className="container" style={{ position: 'relative' }}>
       <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px', // 添加间隔
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
          disabled={previous === "first one"} //unclickable
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
          disabled={next === "last one"} // unclickable
        >
          Next
        </button>
      </div>
      <h1>My Answer</h1>
      <Form onFinish={handleFormSubmit} style={{ width: '400px', margin: '0 auto' }}>
        <Form.Item label="Question" className="question-item">
          <div>{question}</div>
        </Form.Item>

        {/* choose the cursor */}
        <Form.Item label="Cursor Style" className="cursor-item">
          <Select defaultValue={cursorOptions[0].label} onChange={(value) => setCursor(value)}>
            {cursorOptions.map(({ label, value }) => (
              <Select.Option key={value} value={value}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Answer" className="answer-item">

          {/* drag and drop */}
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    padding: '10px',
                    width: '250px',
                    minHeight: '300px',
                    border: '1px solid #000',
                    margin: '0 auto',
                  }}
                >
                  {items.map(({ id, content }, index) => (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                          className={`draggable-row draggable-row-${index}`}
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
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

      <div>
        <h3 className="output-item">Feedback:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default Home;
