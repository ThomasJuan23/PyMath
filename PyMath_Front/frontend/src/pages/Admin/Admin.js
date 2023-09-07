import './admin.css'
import { Redirect, Link, Switch, Route , withRouter} from 'react-router-dom';
import { Breadcrumb, Layout, Menu, useLocation } from 'antd';
import React, { useState } from 'react';
import MHeader from '../../components/AdminHead/index';
import LeftNav from './../../components/AdminLeft/index';
import Admin from '../AdminHome/home'
import AddAnswer from '../AddAnswer/home'
import usermanage from '../UserManage/home'
import AdminMessage from '../Message/message'
import chat from '../Chat/home'
import EditAnswer from '../EditAnswer/home'



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
          {/* set the routh path of admin end */}
        <Switch>
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

