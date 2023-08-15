import React, { useState, useRef } from 'react';
import logo from '../../assets/images/logo192.png';
import { Form, Input, Button, message } from 'antd';
import './register.css';

const sampleData = [
  {
    email: 'user1@example.com',
    safeQuestion: 'What is your pet\'s name?',
    safeAnswer: 'Buddy'
  },
  {
    email: 'user2@example.com',
    safeQuestion: 'What is your mother\'s maiden name?',
    safeAnswer: 'Smith'
  }
];

const ResetPassword = () => {
  const [form] = Form.useForm();
  const [safeQuestion, setSafeQuestion] = useState(''); // Assuming you fetch this from the backend based on email
  const [canReset, setCanReset] = useState(false); // Will determine if user can enter new password

  const onEmailChange = (email) => {
    const user = sampleData.find(user => user.email === email);
    if (user) {
      setSafeQuestion(user.safeQuestion);
    } else {
      setSafeQuestion(''); // Reset question if email is not found
    }
  };
  

  const onAnswerSubmit = (email, answer) => {
    const user = sampleData.find(user => user.email === email);
    if (user && user.safeAnswer === answer) {
      setCanReset(true);
    } else {
      message.error('Incorrect answer. Please try again.');
    }
  };
  

  const onFinish = (values) => {
    if (canReset) {
      // Update password in backend
      // Placeholder:
      // const result = await updatePassword(values.email, values.newPassword);
      // For now, let's just show a success message
      message.success('Password updated successfully!');
    } else {
      onAnswerSubmit(values.email, values.answer);
    }
  };
  

  return (
    <div className='register'>
      <div className="login-header">
        <img src={logo} alt="" />
        <h1>PyMath</h1>
      </div>
      <div className='login-content'>
        <h1>Reset Password</h1>
        <Form
          form={form}
          name="reset-password"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                required: true,
                message: 'Please input your E-mail!',
              },
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              }
            ]}
            onChange={(e) => onEmailChange(e.target.value)}
          >
            <Input />
          </Form.Item>

          {safeQuestion && (
            <Form.Item
              name="answer"
              label={safeQuestion}
              rules={[
                {
                  required: true,
                  message: 'Please provide the answer!',
                }
              ]}
            >
              <Input placeholder="Enter your answer" />
            </Form.Item>
          )}

          {canReset && (
            <>
              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your new password!',
                  },
                  {
                    pattern: new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})'),
                    message: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character.',
                  }
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={['newPassword']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your new password!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords that you entered do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {canReset ? 'Update Password' : 'Submit Answer'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
