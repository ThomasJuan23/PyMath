import React, { useState } from 'react';
import logo from '../../assets/images/logo192.png';
import { Form, Input, Button, message } from 'antd';
import './register.css';
import { getSafeQuestion, verifySafeAnswer, changePassword } from '../../api';

const ResetPassword = () => {
  const [form] = Form.useForm();
  const [safeQuestion, setSafeQuestion] = useState('');
  const [canReset, setCanReset] = useState(false);
 //get safe answer
  const fetchSafeQuestion = async (email) => {
    try {
      const response = await getSafeQuestion(email);
      if (response.code === 200) {
        setSafeQuestion(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('Error fetching safe question.');
    }
  };
// show the safe question
  const handleFetchQuestionClick = () => {
    const email = form.getFieldValue('email');
    if (email) {
      fetchSafeQuestion(email);
    } else {
      message.error('Please input your E-mail first!');
    }
  };
  //handle safe answer 
  const onAnswerSubmit = async (email, answer) => {
    try {
      const response = await verifySafeAnswer(email, answer);
      if (response.code === 200) {
        setCanReset(true);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('Error verifying answer.');
    }
  };

  const onFinish = async (values) => {
    if (canReset) {
      try {
        const response = await changePassword(values.email, values.newPassword);
        if (response.code === 200) {
          message.success('Password updated successfully!');
        } else {
          message.error(response.message);
        }
      } catch (error) {
        message.error('Error updating password.');
      }
    } else {
      await onAnswerSubmit(values.email, values.answer);
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
          >
            <Input />
          </Form.Item>
{/* after input email, it shows */}
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
{/* after check safe answer, it shows */}
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
                    pattern: new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})'),
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

          <Form.Item style={{ textAlign: 'center' }}>
            {!safeQuestion && (
              <Button type="primary" onClick={handleFetchQuestionClick}>
                Fetch Safe Question
              </Button>
            )}

            {safeQuestion && !canReset && (
              <Button type="primary" htmlType="submit">
                Submit Answer
              </Button>
            )}

            {canReset && (
              <Button type="primary" htmlType="submit">
                Update Password
              </Button>
            )}
          </Form.Item>

        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
