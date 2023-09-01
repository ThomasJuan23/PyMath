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
import MHeader from '../../components/AdminHead/index';
import LeftNav from './../../components/AdminLeft/index';
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
import usermanage from '../UserManage/home'
import AdminMessage from '../Message/message'
import chat from '../Chat/home'
import EditAnswer from '../EditAnswer/home'



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
            {/* <Route path='/home' component={Home}></Route>
            <Route path='/answer' component={Answer}></Route>
            <Route path='/drag' component={Drag}></Route>
            <Route path='/dragexample' component={DragExample}></Route>
            <Route path='/answerexample' component={AnswerExample}></Route>
            <Route path='/userhome' component={User}></Route>
            <Route path='/teacherhome' component={Teacher}></Route>
            <Route path='/upload' component={Upload}></Route>
            <Route path='/detail' component={Detail}></Route> */}
            <Route path='/admin/adminhome' component={Admin}></Route>
            <Route path='/admin/addanswer' component={AddAnswer}></Route>
            <Route path='/admin/editanswer' component={EditAnswer}></Route>
            <Route path='/admin/usermanage' component={usermanage}></Route>
            <Route path='/admin/message' component={AdminMessage}></Route>
            <Route path='/admin/chat' component={chat}></Route>
            <Redirect to='/admin/adminhome' />
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

