import React, { useState, useRef } from 'react'
import logo from '../../assets/images/logo192.png'
import './register.css'
import emailjs from 'emailjs-com'
import { reqSendEmail, verifyEmail, registerUser } from '../../api/index';


import { useHistory } from 'react-router-dom';
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
  const sendEmail = async () => {
    const email = formRef.current.getFieldValue("email");
    const username = formRef.current.getFieldValue("username");
  
    // 1. 检查 email 是否为空
    if (!email) {
      message.error("Please enter your email address."); // 使用 antd 的 message 组件显示错误消息
      return; // 结束函数执行
    }
  
    try {
      // 2. 调用后端 API 接口来发送电子邮件
      const result = await reqSendEmail(email);
  
      // 3. 检查响应码
      if (result.code !== 200) {
        message.error(`An error occurred: ${result.message}`); // 反馈给客服
      } else {
        message.success("Verification email has been sent. If you donot receive your email in 1 min, please check your input"); // 告诉用户验证邮件已发送
      }
    } catch (error) {
      // 网络错误或其他问题
      message.error("An unexpected error occurred. Please try again later.");
    }
  };
    // if (result && result.success) {
    // // 这里假设后端返回了一个包含 "success" 字段的对象，您可以根据实际后端响应进行调整
    //   message.success("Verification email sent successfully");
    //  } else {
    //   message.error("Failed to send verification email");
    //    }
   //  const email = formRef.current.getFieldValue("email");
    // const username = formRef.current.getFieldValue("username");
    // const code = Math.floor(100000 + Math.random() * 900000);
    // setVerificationCode(code);
    // console.log(code)
    // const params = {
    //   email: email,
    //   username: username,
    //   code: code
    // }
    // emailjs
    //   .send('service_r5sgj3i', "template_qvv579v", params, "srp7GX-kcLCEPBT3R")
    //   .then(
    //     result => {
    //       console.log(result.text)
    //     },
    //     error => {
    //       console.log(error.text)
    //       alert(error.text)
    //     }
    //   )
//  }
  const onFinish = async (values) => {
    // console.log('Received values of form: ', values);
    // const { email, username, role, password, confirm, description, address, postcode } = values;
    // // history.replace('/login')
    // console.log('Received values of form' + description, address, postcode);
    // console.log(role);

    const email = formRef.current.getFieldValue("email");
    const code = formRef.current.getFieldValue("code");
  
    // 1. 检查 email 是否为空
    if (!code) {
      message.error("Please enter the verification Code."); // 使用 antd 的 message 组件显示错误消息
      return; // 结束函数执行
    }
  
    try {
      // 2. 调用后端 API 接口来发送电子邮件
      const result = await verifyEmail(email,code);
      // 3. 检查响应码
      if (result.code !== 200) {
        message.error(`An error1111 occurred: ${result.message}`); // 反馈给客服
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
        //调用register函数
        const result2 = await registerUser(email,username,role,password,birthday,age,inst,real,ID,sQ,sA);
        if(result2.code!=200){
          message.error(`An error2222 occurred: ${result2.message}`); 
        }
        else{
          message.success("Register Successfully")
          history.replace('/login')
        }
      }
    } catch (error) {
      // 网络错误或其他问题
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
                validator: (_, value) => {
                  const regex = /^\d{4}-[01][0-9]-[0-3][0-9]$/;
                  if (regex.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Date format must be dd/mm/yyyy!'));
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
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: 'Please input the verification code!',
                  //   },
                  //   () => ({
                  //     validator(_, value) {
                  //       if (Number(value) === verificationCode) {
                  //         return Promise.resolve();
                  //       }
                  //       return Promise.reject(new Error('The verification code is not correct!'));
                  //     },
                  //   }),
                  // ]}
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
