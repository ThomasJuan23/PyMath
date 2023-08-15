import React, { Component } from 'react'
import logo from '../../assets/images/logo192.png'
import './login.css'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';//从antd上直接拿组件，注意看依赖v4和之前的极其不兼容，网上教程都是v3
import { reqLogin_email, reqLogin_username } from '../../api';
import storageUtils from '../../utils/storageUtils';
import { useHistory} from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Tabs } from 'antd';


const App = () => {
  const history = useHistory()


  const onFinish_email = async (values) => {
    // console.log(values);
    // storageUtils.saveUser(values)
    // history.push('/manager')
    // // 跳转测试,实际用的应该replace好一些，因为replace没有后退，push有。
    // console.log('Received values of form: ', values);
    // message.success('login successfully')

    // const { email, password } = values;
    // const res_json = await reqLogin_email(email, password);//把用户名密码传过去，用了ES6的async，await
    // console.log("芝士res" + res_json.data);
    // const res = JSON.parse(res_json.data);
    // console.log(res)
    // console.log(res.return_obj)

    // console.log("Successfully")
    // // 登录成功传回来的code是100时，把用户信息存到本地。
    // if (res.code === 100) {
    //   const user = res.userInfo;
    //   storageUtils.saveUser(res.return_obj);
    //   // 跳转到导航页面
    //   history.replace('/')
    //   // 本来想用this.props.history.replace('/admin')的，但是antd这里form有点怪props我没搞明白，直接用文档里的例子了。
    //   message.success('login successfully')

    // } else {
    //   message.error(res.msg);
    // }
    
    const { email, password } = values;
    const res_json = await reqLogin_email(email, password);//把用户名密码传过去，用了ES6的async，await
    console.log("芝士res" + res_json.data);
    const res = JSON.parse(res_json.data);
    console.log(res)
    // console.log(res.return_obj)
    //console.log(res.return_obj.role)
    // 登录成功传回来的code是100时，把用户信息存到本地。
    if (res.code === 100) {
      const user = res.userInfo;
      storageUtils.saveUser(res.return_obj);
      // 跳转到导航页面
      if (res.return_obj.role === "customer") {
        history.replace('/')
        message.success('login successfully')
      } else if (res.return_obj.role === "admin") {
        history.replace('/manager')
        message.success('login successfully')
      } else if (res.return_obj.role === "serviceProvider") {
        if (res.return_obj.available ) {
          history.replace('/provider')
          message.success('login successfully')
        }
        else {
          history.replace('/waitProvider')
          message.info('Require further information')
        }
      }
    } else {
      message.error(res.msg);
    }

  };
  const onFinish_username = async (values) => {

    const { username, password } = values;
    const res_json = await reqLogin_username(username, password);//把用户名密码传过去，用了ES6的async，await
    console.log("芝士res" + res_json.data);
    const res = JSON.parse(res_json.data);
    console.log(res)
    // console.log(res.return_obj)
    //console.log(res.return_obj.role)
    // 登录成功传回来的code是100时，把用户信息存到本地。
    if (res.code === 100) {
      const user = res.userInfo;
      storageUtils.saveUser(res.return_obj);
      // 跳转到导航页面
      if (res.return_obj.role === "customer") {
        history.replace('/')
        message.success('login successfully')
      } else if (res.return_obj.role === "admin") {
        history.replace('/manager')
        message.success('login successfully')
      } else if (res.return_obj.role === "serviceProvider") {
        if (res.return_obj.available ) {
          history.replace('/provider')
          message.success('login successfully')
        }
        else {
          history.replace('/waitProvider')
          message.info('Require further information')
        }
      }
    } else {
      message.error(res.msg);
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
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish_email}
              >
                <Form.Item
                  name="email"
                  //自定义式的验证各种出错,这个是声明式验证
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Email!',
                    },
                    {
                      min: 1,
                      message: 'user name must be longer than 1 characters'
                    },
                    {
                      max: 16,
                      message: 'user name must be shorter than 16 characters'
                    },
                    {
                      pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                      message: 'Must be entered a valid email address must '
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
                      message: 'user name must be longer than 6 characters'
                    },
                    {
                      max: 16,
                      message: 'user name must be shorter than 16 characters'
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
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>

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
            },
            {
              label: `Username`,
              key: '2',
              children: <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish_username}
              >
                <Form.Item
                  name="username"
                  //自定义式的验证各种出错,这个是声明式验证
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Username!',
                    },
                    {
                      min: 1,
                      message: 'user name must be longer than 1 characters'
                    },
                    {
                      max: 16,
                      message: 'user name must be shorter than 16 characters'
                    },
                    {
                      pattern: /^[a-zA-Z\d_]+$/,
                      message: 'Must be composed of English, numbers or underscores'
                    }
                  ]}
                >
                  <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
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
                      message: 'user name must be longer than 6 characters'
                    },
                    {
                      max: 16,
                      message: 'user name must be shorter than 16 characters'
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
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>

                  <a className="login-form-forgot" href="">
                    Forgot password
                  </a>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                  </Button>
                  Or   <a href="/register">register now!</a>
                </Form.Item>
              </Form>,
            }
          ]}
        />

      </div>
    </div>
  )

}

export default App;


