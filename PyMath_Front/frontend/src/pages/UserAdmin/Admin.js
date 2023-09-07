import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import {Layout} from 'antd';
import LeftNav from './../../components/LeftNav/index';
import MHeader from '../../components/HeadNav/index';
import Answer from '../AnswerQuestion/home';
import Drag from '../DragAnswer/home';
import DragExample from '../DragExample/home';
import AnswerExample from '../AnswerExample/home';
import User from '../UserHome/home';
import UserProfile from '../UserProfile/home';
import chat from '../Chat/home';
import message from '../Message/message';
import UserHistory from '../UserHistory/home';
import storageUtils from '../../utils/storageUtils';

const { Content, Footer } = Layout;

const App = () => {
  // Check if user is logged in
  const user = storageUtils.getUser();
  const isLoggedI = !!user.username;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* If not logged in, redirect to /login */}
      {!isLoggedI ? <Redirect to="/" /> : null}

      <LeftNav />
      <Layout className="site-layout">
        <MHeader />
        <Content style={{ margin: '0 0px' }}>
          <Switch>    
            {/* user admin routh path design */}
            <Route path="/useradmin/answer" component={Answer} />
            <Route path="/useradmin/drag" component={Drag} />
            <Route path="/useradmin/dragexample" component={DragExample} />
            <Route path="/useradmin/answerexample" component={AnswerExample} />
            <Route path="/useradmin/userhome" component={User} />
            <Route path="/useradmin/userinfo" component={UserProfile} />
            <Route path="/useradmin/chat" component={chat} />
            <Route path="/useradmin/message" component={message} />
            <Route path="/useradmin/history" component={UserHistory} />
            <Redirect to="/useradmin/userhome" />
          </Switch>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Zcy designed ©2023</Footer>
      </Layout>
    </Layout>
  );
};

export default App;
