import React, { useState } from 'react';
import { Breadcrumb, Layout, Menu, Button, Form } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import axios from 'axios';
import { Base64 } from 'js-base64';

const Home = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
const handleFormSubmit = async (event) => {
  try {
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
      <h1>My Answer</h1>

      <Form onFinish={handleFormSubmit} style={{ width: '400px' }}>
        <Form.Item label="Question">
          <div style={{ marginBottom: '10px' }}>Example Question: example1</div>
        </Form.Item>
        <Form.Item label="Answer">
          <MonacoEditor
            width="100%"
            height="300px"
            language="python"
            theme="vs-dark"
            value={code}
            onChange={(value) => {
              setCode(value);
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Submit</Button>
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
