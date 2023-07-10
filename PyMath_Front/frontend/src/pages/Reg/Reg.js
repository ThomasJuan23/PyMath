import React, { useState, useRef } from 'react'
import logo from '../../assets/images/logo192.png'
import './register.css'
import emailjs from 'emailjs-com'


import { useHistory } from 'react-router-dom';
import { reqServiceRegister, reqRegister, reqProviderRegister, reqAddService } from '../../api';
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Radio,
  message,
  notification
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




const openNotification = () => {
  notification.open({
    message: 'It takes a few seconds',
    description:
      'Please wait for your approval by the administrator, you can log in to check your approval process; if you cannot log in, it proves that your account application has been rejected',
    onClick: () => {
      console.log('Notification Clicked!');
    },
  });
};
const App = () => {
  const history = useHistory()
  const [form] = Form.useForm();
  const [showDescription, setShowDescription] = useState(false);
  const formRef = useRef();
const [verificationCode, setVerificationCode] = useState(null);
const sendEmail = () => {
  const email = formRef.current.getFieldValue("email");
  const username = formRef.current.getFieldValue("username");
  const code = Math.floor(100000 + Math.random() * 900000);
  setVerificationCode(code);
  console.log(code)
  const params = {
    email : email,
    username : username,
    code : code
  }
  emailjs
    .send('service_r5sgj3i', "template_qvv579v", params, "srp7GX-kcLCEPBT3R")
    .then(
      result => {
        console.log(result.text)
      },
      error => {
        console.log(error.text)
        alert(error.text)
      }
    )
}
  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    const { email, username, role, password, confirm, description, address, postcode } = values;
    // history.replace('/login')
    console.log('Received values of form' + description, address, postcode);
    console.log(role);
    if (role == "customer") {

      const res_json = await reqRegister(email, username, role, password, confirm);
      console.log("芝士" + res_json);
      const res = JSON.parse(res_json.data);

      if (res.code === 110) {
        message.success("registers successfully");
        history.replace('/login')
      } else {
        message.error(res.msg);
      }
    }
    else {
      const res_json = await reqProviderRegister(email, username, role, password, confirm, description, address, postcode);
      console.log("芝士" + res_json);
      const res = JSON.parse(res_json.data);
      console.log(res);
      if (res.code === 110) {
        openNotification();
        sendrequest(email)
        history.replace('/login')
      } else {
        message.error(res.msg);

      }
    }
  };
  const sendrequest = async (email) => {
    const res = await reqAddService(email, 'admin@admin.com', null, null, null, 'newaccount')
  }
  const handleRoleChange = (e) => {
    const roleValue = e.target.value;
    setShowDescription(roleValue === 'serviceProvider');
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
          // initialValues={{
          //   residence: ['zhejiang', 'hangzhou', 'xihu'],
          //   prefix: '86',
          // }}
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
            label="Email verification code"
            {...formItemLayout}
          >
            <Row gutter={8}>
              <Col span={16}>
                <Form.Item
                  name="Email verification code"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the verification code!',
                    },
                    () => ({
                      validator(_, value) {
                        if (Number(value) === verificationCode) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('The verification code is not correct!'));
                      },
                    }),
                  ]}
                  noStyle
                >
                  <Input placeholder="Please input the verification code!" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Button 
                style={{
                  backgroundColor:'white',
                  color : 'black',
                  margin : 5,
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
                { label: "11-13", value: "11" },
                { label: "13-15", value: "13" },
                { label: "15-17", value: "15" },
                { label: "17-18", value: "17" }
              ]}
              onChange={handleRoleChange}
            />
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
                { label: "Student", value: "customer" },
                { label: "Teacher", value: "serviceProvider" }
              ]}
              onChange={handleRoleChange}
            />
          </Form.Item>

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
