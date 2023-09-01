import React, { Component } from 'react'
import { withRouter, Link } from "react-router-dom";
import { Layout, Button, Modal, Badge } from "antd";
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import menuList from '../../config/menuConfig';
import { getMessageByReceiver} from '../../api';
//import { reqMyMessage } from '../../api/index';

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
    this.userEmail = storageUtils.getUser();
    console.log('发到后端的客户邮箱' + this.userEmail)
  }


  loadMessage = async () => {
    const result = await getMessageByReceiver(1,storageUtils.getUser())
    if (result.code === 200) {
      this.setState({ count: result.data.total });
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
    this.props.history.replace('/admin/message');
  }
  logout = () => {
    confirm({
      title: 'Sure to logout？',
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
    const { num , count } = this.state;
    // const user = this.props.user;
    return (
      <Header style={{ background: '#fff', padding: 0 }}>
        <div className="header">
          <h2 className='header-title'></h2>
          <div className="header-user">

            <div className='userInfo'>
            welcome，{storageUtils.getUser()}
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
                  <Link to='/admin/message'></Link>
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
