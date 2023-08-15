import './admin.css'
import storageUtils from '../../utils/storageUtils'
import { Redirect, Link, Switch, Route , withRouter} from 'react-router-dom';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, useLocation } from 'antd';
import React, { useState } from 'react';
import Logo from '../../assets/images/logo192.png';
import MHeader from '../../components/HeadNav/index';
import LeftNav from './../../components/LeftNav/index';
import Home from '../Home/home';
import Detail from '../QuestionDetail/home'
import Answer from '../AnswerQuestion/home';
import Drag from '../DragAnswer/home';
import DragExample from '../DragExample/home'
import AnswerExample from '../AnswerExample/home'
import User from '../UserHome/home'
import Teacher from '../TeacherHome/home'
import Upload from '../UploadQuestion/home';
import Admin from '../AdminHome/home'
import AddAnswer from '../AddAnswer/home'
import UserProfile from '../UserProfile/home'
import chat from '../Chat/Userchat'



const { Header, Content, Footer, Sider } = Layout;

const App = () => {
 // const [collapsed, setCollapsed] = useState(false);
 // const user = storageUtils.getUser();
 // console.log('芝士user'+user.username)
  //若内存中存了用户名，则已登录，否则跳转至登录界面
  // // 前后跑通再取消注释是

  // if (!user.username) {
  //   return <Redirect to='/login' />
  // }

  return (

    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
     <LeftNav></LeftNav>
      <Layout className="site-layout">
        {/* <Header
          className="site-layout-background"
          style={{
            padding: 0,
          }}
        /> */}
        <MHeader></MHeader>

        <Content
          style={{
            margin: '0 0px',
          }}
        >
        <Switch>
            {/* <Route path='/home' component={Home}></Route> */}
            <Route path='/useradmin/answer' component={Answer}></Route>
            <Route path='/useradmin/drag' component={Drag}></Route>
            <Route path='/useradmin/dragexample' component={DragExample}></Route>
            <Route path='/useradmin/answerexample' component={AnswerExample}></Route>
            <Route path='/useradmin/userhome' component={User}></Route>
            <Route path='/useradmin/userinfo' component={UserProfile}></Route>
            <Route path='/useradmin/chat' component={chat}></Route>
            {/* <Route path='/teacherhome' component={Teacher}></Route>
            <Route path='/upload' component={Upload}></Route>
            <Route path='/detail' component={Detail}></Route>
            <Route path='/adminhome' component={Admin}></Route>
            <Route path='/addanswer' component={AddAnswer}></Route> */}
            <Redirect to='/useradmin/userhome' />
        </Switch>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Zcy designed ©2023
        </Footer>
      </Layout>
    </Layout>
  );
};
export default App;

