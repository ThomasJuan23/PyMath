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
    const result = await loginUser(email, password);//把用户名密码传过去，用了ES6的async，await
    if (result.code === 200) {
      const result2 = await getUserList(1,null,null,email,null);
      if(result2.code == 200){
      storageUtils.saveUser(email);
      const role = result2.data.records[0].type
      // 跳转到导航页面
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
  
  //嘎嘎偷
  return (
    <div className='login'>
      <div className="login-header">
        <img src={logo} alt="" />
        {/* 模块化输出搞个图 */}
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
                  //自定义式的验证各种出错,这个是声明式验证
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

                  rules={[
                    // { validator: this.validatorPwd }          
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
                  {/* 输入不对时弹行字 */}
                  <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                  />
                </Form.Item>
                <Form.Item>

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


