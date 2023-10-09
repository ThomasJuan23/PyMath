import React, { Component } from 'react'
import logo from '../../assets/images/logo192.png'
import './login.css'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';//从antd上直接拿组件，注意看依赖v4和之前的极其不兼容，网上教程都是v3
import { loginUser, getUserList } from '../../api';
import storageUtils from '../../utils/storageUtils';
import { useHistory} from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Tabs } from 'antd';


const App = () => {
  const history = useHistory()


  const onFinish_email = async (values) => {
    const { email, password } = values;
    const result = await loginUser(email, password);//check login info request
    if (result.code === 200) {
      const result2 = await getUserList(1,null,null,email,null);
      if(result2.code == 200){
      storageUtils.saveUser(email);
      const role = result2.data.records[0].type
      // jump to different end
      if (role === "student") {
        history.replace('/useradmin')
        message.success('login successfully')
      } else if (role === "admin") {
        history.replace('/admin')
        message.success('login successfully')
      } else if (role === "teacher") {
          history.replace('/teacheradmin')
          message.info('login successfully')
      }}
      else{
        message.error("role error"+result2.message);
      }
    } else {
      message.error("login error"+result.message);
    }

  };
  
  return (
    <div className='login'>
      <div className="login-header">
        <img src={logo} alt="" />
        <h1>PyMath</h1>
      </div>
      <div className='login-content'>
        <h1>Login</h1>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: `Email`,
              key: '1',
              children: <Form
                name="normal_login"
                className="login-form"
                onFinish={onFinish_email}
              >
                <Form.Item
                  name="email"
                  //real time check
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
                  <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                </Form.Item>
                <Form.Item
                  name="password"
  //password rule
                  rules={[
                 
                    {
                      required: true,
                      message: 'Please input your Password!',
                    },

                    {
                      min: 6,
                      message: 'password be longer than 6 characters'
                    },
                    {
                      max: 16,
                      message: 'password must be shorter than 16 characters'
                    },
                    {
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,16}/,
                      message: 'Must contain uppercase letters, lowercase letters, numbers and special characters'
                    }
                  ]}
                >
                  {/* password input */}
                  <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                  />
                </Form.Item>
                <Form.Item>
              {/* reset password */}
                  <Link className="login-form-forgot" to="/reset">
                    Forgot password
                  </Link>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                  </Button>
                  Or   <Link to="/register">register now!</Link>
                </Form.Item>
              </Form>
            }
          ]}
        />

      </div>
    </div>
  )

}

export default App;


