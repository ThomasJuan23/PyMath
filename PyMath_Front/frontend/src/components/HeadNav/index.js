import React, { Component } from 'react'
import { withRouter, Link } from "react-router-dom";
import { Layout, Button, Modal, Badge } from "antd";
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import menuList from '../../config/menuConfig';
import { reqMyMessage } from '../../api/index';

import {
  NotificationOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import './index.css'
// 通过connect高级组件 对普通组件进行包装
import { connect } from "react-redux";
const { Header } = Layout;
const { confirm } = Modal;


class MHeader extends Component {
  dataPreparation = () => {
    let user = memoryUtils.user
    this.userEmail = user.email
    console.log('发到后端的客户邮箱' + this.userEmail)
  }


  loadMessage = async () => {
    const email = this.userEmail;
    let result_json
    console.log(email)
    result_json = await reqMyMessage(email);
    console.log("shut up" + result_json.data);
    const result = JSON.parse(result_json.data);
    console.log("shut down" + result.code);
    console.log("看看长度" + this.count);
    if (result.code === 200) {
      console.log("shut down" + result.return_obj);
      this.setState({ count: result.return_obj.length });
      console.log("看看长度" + this.state.count);
    }
  }




  constructor(props) {
    super(props);
    this.state = {
      num: 5,
      count:0,
      
    }
  }
  message = () => {
    this.setState({ count:0 })
    this.props.history.replace('/message');
  }
  logout = () => {
    confirm({
      title: '确定要退出登录吗？',
      onOk: () => {
        storageUtils.removeUser();
        // memoryUtils.user = {};
        // this.props.removeUser();
        this.props.history.replace('/login');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  getTitle = () => {
    // 获取动态的标题
    let title = '';
    // 根据当前请求的path得到对应的title
    const path = this.props.location.pathname;
    console.log(path);
    menuList.forEach(item => {
      if (item.key === path) {
        title = item.title;
      }
    })
    return title;

  }
  load = () => {
    this.state.num = 5
  }
  componentDidMount() {
    this.load()
    this.dataPreparation();
    this.loadMessage();
  }

  render() {
    const user = "sfsd";
    const { num , count } = this.state;
    // const user = this.props.user;
    console.log(user.username + '123');
    console.log(this.props);
    return (
      <Header style={{ background: '#fff', padding: 0 }}>
        <div className="header">
          <h2 className='header-title'></h2>
          <div className="header-user">

            <div className='userInfo'>
              welcome，{user.username}
              <Button onClick={this.logout}>log out</Button>

            </div>
            <div className='infoButton'>
              <Badge
                count={count}
                size="small">
                <Button
                  icon={<NotificationOutlined />}
                  type='default'
                  size='medium'
                  onClick={this.message}
                >
                  {/* <Link to='/message'></Link> */}
                </Button>
              </Badge>
            </div>
          </div>
        </div>
      </Header>
    )
  }
}
export default withRouter(MHeader);
