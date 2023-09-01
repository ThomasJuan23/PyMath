import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button, Form, Select, message } from 'antd';
import Joyride, { STATUS } from 'react-joyride';
import storageUtils from '../../utils/storageUtils';
import { addHistory, getQuestions, verifyAnswer, getAfterQuestion, getBeforeQuestion } from '../../api';
import './home.css';
import m1 from '../../../public/mouse1.cur';
import m2 from '../../../public/mouse2.cur';
import m3 from '../../../public/mouse3.cur';
import m4 from '../../../public/mouse4.cur';
import m5 from '../../../public/mouse5.cur';
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

const initialStepsPart1 = [
  {
    target: '.question-item',
    content: 'This is where the question is presented. Read it carefully.',
  },
  {
    target: '.cursor-item',
    content: 'This is where you can choose the cursor style.',
  },
  {
    target: '.answer-item',
    content: 'This is where you arrange the code blocks to answer the question.',
  },
];

const initialStepsPart2 = [
  {
    target: '.output-item',
    content: 'This is where the output will be displayed.',
  },
];

const Home = () => {
  const history = useHistory();
  const [items, setItems] = useState([]);
  const [output, setOutput] = useState('');
  const [cursor, setCursor] = useState(cursorOptions[0].value);
  const [run, setRun] = useState(true);
  const [steps, setSteps] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState([]);
  const [explain, setExplain] = useState('');
  const [randomizedAnswer, setRandomizedAnswer] = useState([]);
  const [randomizedExplain, setRandomizedExplain] = useState([]);
  const [type, setType] = useState('');
  const [previous, setPrevious] = useState('');
  const [next, setNext] = useState('');

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      const result = await getQuestions(1, storageUtils.getQuestion(), null, null, null, null, null, null, null);
      if (result.code === 200) {
        setQuestion(result.data.records[0].question);
        setAnswer(result.data.records[0].answer.split('\n'));
        setExplain(result.data.records[0].answerExplain);
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

  // const handleFormSubmit = async (event) => {
//   try {
//     const encodedCode = Base64.encode(code);

//     const options1 = {
//       method: 'POST',
//       url: 'https://judge0-ce.p.rapidapi.com/submissions',
//       params: {
//         base64_encoded: 'true',
//         fields: '*'
//       },
//       headers: {
//         'content-type': 'application/json',
//         'Content-Type': 'application/json',
//         'X-RapidAPI-Key': '0587ce0408msh08968b209325ec6p1219bbjsn9162c118313a',
//         'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
//       },
//       data: {
//         language_id: 71,
//         source_code: encodedCode
//       }
//     };

//     const response = await axios.request(options1);
//     console.log(response.data);
//     const submissionId = response.data.token;

//     const fetchResult = async () => {
//       try {
//         const options2 = {
//           method: 'GET',
//           url: `https://judge0-ce.p.rapidapi.com/submissions/${submissionId}`,
//           params: {
//             base64_encoded: 'true',
//             fields: '*'
//           },
//           headers: {
//             'X-RapidAPI-Key': '0587ce0408msh08968b209325ec6p1219bbjsn9162c118313a',
//             'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
//           }
//         };

//         const result = await axios.request(options2);
//         console.log(result.data);
//         const { status_id, stdout, stderr } = result.data;

//         if (status_id === 1 || status_id === 2) {
//           setTimeout(fetchResult, 1000);
//         } else {
//           if (stdout) {
//             const decodedOutput = Base64.decode(stdout);
//             setOutput(decodedOutput);
//           } else if (stderr) {
//             const decodedError = Base64.decode(stderr);
//             setOutput(decodedError);
//           } else {
//             setOutput('No output available.');
//           }
//         }
//       } catch (error) {
//         console.error(error);
//         setOutput('Failed to fetch result.');
//       }
//     };

//     setTimeout(fetchResult, 1000);
//   } catch (error) {
//     console.error(error);
//     setOutput('Failed to execute Python code.');
//   }
// };

  useEffect(() => {
    const splitExplain = explain.split('\n');
    const shuffledIndexes = [...Array(answer.length).keys()].sort(() => Math.random() - 0.5);

    const shuffledAnswer = shuffledIndexes.map((index) => answer[index]);
    const shuffledExplain = shuffledIndexes.map((index) => splitExplain[index]);

    setRandomizedAnswer(shuffledAnswer);
    setRandomizedExplain(shuffledExplain);
  }, [answer, explain]);

  useEffect(() => {
    const initialItems = randomizedAnswer.map((content, index) => ({
      id: `item-${index}`,
      content: content,
      type: `line${index + 1}`,
    }));

    const itemSteps = randomizedExplain.map((item, index) => ({
      target: `.draggable-row-${index}`,
      content: item,
    }));

    setItems(initialItems);
    setSteps([...initialStepsPart1, ...itemSteps, ...initialStepsPart2]);
  }, [randomizedAnswer, randomizedExplain]);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
    }
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const itemsClone = reorder(items, result.source.index, result.destination.index);
    setItems(itemsClone);
  };

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
        fetchQuestion()
        if(level==2)
        history.replace('/useradmin/drag')
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
        fetchQuestion()
        if(level==2)
        history.replace('/useradmin/drag')
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
          disabled={previous === "first one"} // 设为不可点击状态
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
          disabled={next === "last one"} // 设为不可点击状态
        >
          Next
        </button>
      </div>
      <Joyride
        callback={handleJoyrideCallback}
        continuous={true}
        run={run}
        scrollToFirstStep={true}
        showProgress={true}
        showSkipButton={true}
        steps={steps}
        styles={{
          options: {
            primaryColor: '#AE32F5',
            zIndex: 10000,
          },
        }}
      />

      <h1>My Answer</h1>
      <Form onFinish={handleFormSubmit} style={{ width: '400px', margin: '0 auto' }}>
        <Form.Item label="Question" className="question-item">
          <div>{question}</div>
        </Form.Item>
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
