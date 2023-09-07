import React, { useState, useRef } from 'react'
import logo from '../../assets/images/logo192.png'
import './register.css'
import { reqSendEmail, verifyEmail, registerUser } from '../../api/index';


import { useHistory } from 'react-router-dom';
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Radio,
  message,
} from 'antd';
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const App = () => {
  const history = useHistory()
  const [form] = Form.useForm();
  const [showDescription, setShowDescription] = useState(false);
  const formRef = useRef();
  const sendEmail = async () => {
    const email = formRef.current.getFieldValue("email");
    const username = formRef.current.getFieldValue("username");
  
    // 1. check email valid
    if (!email) {
      message.error("Please enter your email address."); // message to show the error
      return; 
    }
  
    try {
      // 2.req send email api
      const result = await reqSendEmail(email);
  
      // 3. check the code
      if (result.code !== 200) {
        message.error(`An error occurred: ${result.message}`); 
      } else {
        message.success("Verification email has been sent. If you donot receive your email in 1 min, please check your input"); //show the succefully information
      }
    } catch (error) {
      message.error("An unexpected error occurred. Please try again later.");
    }
  };
  const onFinish = async (values) => {
    const email = formRef.current.getFieldValue("email");
    const code = formRef.current.getFieldValue("code");

    if (!code) {
      message.error("Please enter the verification Code."); 
      return; 
    }
  
    try { //verify the email before register
      const result = await verifyEmail(email,code);
  
      if (result.code !== 200) {
        message.error(`An error1111 occurred: ${result.message}`); 
      } else {
        const username = formRef.current.getFieldValue("username");
        const password = formRef.current.getFieldValue("password");
        const birthday = formRef.current.getFieldValue("birthday");
        const age = formRef.current.getFieldValue("age");
        const sQ= formRef.current.getFieldValue("safeQuestion");
        const sA = formRef.current.getFieldValue("safeAnswer");
        const role = formRef.current.getFieldValue("role");
        const inst = formRef.current.getFieldValue("Institution");
        const real = formRef.current.getFieldValue("Real");
        const ID = formRef.current.getFieldValue("ID card");
        //req register
        const result2 = await registerUser(email,username,role,password,birthday,age,inst,real,ID,sQ,sA);
        if(result2.code!=200){
          message.error(`An error occurred: ${result2.message}`); 
        }
        else{
          message.success("Register Successfully")
          history.replace('/login')
        }
      }
    } catch (error) {
      message.error("An unexpected error occurred. Please try again later.");
    }
  };

  const handleRoleChange = (e) => {
    const roleValue = e.target.value;
    setShowDescription(roleValue === 'teacher');
  };

  return (
    <div className='register'>
      <div className="login-header">
        <img src={logo} alt="" />
        <h1>PyMath</h1>
      </div>
      <div className='login-content'>
        <h1>Register</h1>
        <Form
          ref={formRef}
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          style={{
            maxWidth: 600,
          }}
          scrollToFirstError
        >
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            // chech if the password valid in real time
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                min: 6,
                message: 'the password must be longer than 6 characters'
              },
              {
                max: 16,
                message: 'the password be shorter than 16 characters'
              },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,16}/,
                message: 'Must contain uppercase letters, lowercase letters, numbers and special characters'
              }
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              // compare the password
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="username"
            label="Username"
            tooltip="What do you want others to call you?"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="birthday"
            label="Birthday"
            tooltip="yyyy-mm-dd"
            rules={[
              {
                required: true,
                message: 'Please input your birthday!',
                whitespace: true,
              },
              {
                // check the date format
                validator: (_, value) => {
                  const regex = /^\d{4}-[01][0-9]-[0-3][0-9]$/;
                  if (regex.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Date format must be yyyy-mm-dd!'));
                },
              },
            ]}
          >
            <Input placeholder="yyyy-mm-dd" />
          </Form.Item>
          <Form.Item
            label="Email verification code"
            {...formItemLayout}
          >
            <Row gutter={8}>
              <Col span={16}>
                <Form.Item
                  name="code"
                  noStyle
                >
                  <Input placeholder="Please input the verification code!" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Button
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    margin: 5,
                    border: '1px solid red',
                    borderColor: 'black',
                  }}
                  onClick={sendEmail}
                  type="primary" htmlType="button">Send</Button>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            name="age"
            label="age group"
            rules={[
              {
                required: true,
                message: 'Please choose your age group!',
              },
            ]}
          >
            <Radio.Group
              options={[
                { label: "11-14 (key Stage 3)", value: "11-14" },
                { label: "14-16 (key Stage 4)", value: "14-16" },
                { label: "16-18 (key Stage 4+)", value: "16-18" },
              ]}
              onChange={handleRoleChange}
            />
          </Form.Item>

          <Form.Item
            name="safeQuestion"
            label="Safe Question"
            tooltip="This is used to find your password back"
            rules={[
              {
                required: true,
                message: 'Please input an easy question that you have special answer',
                whitespace: true,
              },
            ]}
          >
            <Input placeholder='Please input an easy question that you have special answer'/>
          </Form.Item>

          <Form.Item
            name="safeAnswer"
            label="Safe Answer"
            tooltip="This is used to find you password back"
            rules={[
              {
                required: true,
                message: 'Please enter your special answer',
                whitespace: true,
              },
            ]}
          >
            <Input placeholder='Please enter your special answer' />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[
              {
                required: true,
                message: 'Please choose your role!',
              },
            ]}
          >
            <Radio.Group
              options={[
                { label: "Student", value: "student" },
                { label: "Teacher", value: "teacher" }
              ]}
              onChange={handleRoleChange}
            />
          </Form.Item>
  {/* decide where show according to the role */}
          {showDescription && (
            <Form.Item
              name="Institution"
              label="institution"
              tooltip="Please enter the institution you teach"
              rules={[
                {
                  required: true,
                  message: 'Please enter the institution you teach',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          )}

          {showDescription && (
            <Form.Item
              name="Real"
              label="Real Name"
              rules={[
                {
                  required: true,
                  message: 'Please input your real name',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          )}

          {showDescription && (
            <Form.Item
              name="ID card"
              label="ID card"
              rules={[
                {
                  required: true,
                  message: 'Please input your teacher ID',
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          )}

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
            Or <a href="/login">Login now!</a>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default App;
