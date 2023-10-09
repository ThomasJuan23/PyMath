import './admin.css'
import { Redirect, Link, Switch, Route , withRouter} from 'react-router-dom';
import { Breadcrumb, Layout, Menu, useLocation } from 'antd';
import React, { useState } from 'react';
import MHeader from '../../components/ProviderHead/index';
import LeftNav from './../../components/ProviderLeft/index';
import Detail from '../QuestionDetail/home'
import Teacher from '../TeacherHome/home'
import Upload from '../UploadQuestion/home';
import teacherinfo from '../TeacherProfile/home'
import message from '../Message/message'
import chat from '../Chat/home'



const { Header, Content, Footer, Sider } = Layout;

const App = () => {


  return (

    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
     <LeftNav></LeftNav>
      <Layout className="site-layout">
  
        <MHeader></MHeader>

        <Content
          style={{
            margin: '0 0px',
          }}
        >
          {/* set teacher end route path */}
        <Switch>
            <Route path='/teacheradmin/teacherhome' component={Teacher}></Route>
            <Route path='/teacheradmin/upload' component={Upload}></Route>
            <Route path='/teacheradmin/detail' component={Detail}></Route>
            <Route path='/teacheradmin/teacherinfo' component={teacherinfo}></Route>
            <Route path='/teacheradmin/message' component={message}></Route>
            <Route path='/teacheradmin/chat' component={chat}></Route>

            <Redirect to='/teacheradmin/teacherhome' />
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

