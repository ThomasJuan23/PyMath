import React, { Component } from 'react'
import { withRouter, Link } from "react-router-dom";
import { Layout, Button, Modal, Badge } from "antd";
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import { reqServices, reqSearchServices,reqProviders, reqMyRequest, sendRequest, updateRequest, reqMyMessage } from '../../api';
import menuList from '../../config/menuConfig';
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
  constructor(props) {
    super(props);
    this.state = {
      num:"*"
    }
  }
  message = () => {
    this.setState({ num : 0})
    this.props.history.replace('/manager/message');
  }
  logout = () => {
    confirm({
      title: 'Log out？',
      onOk: () => {
        storageUtils.removeUser();
        memoryUtils.service = {}
        memoryUtils.request = {}
        memoryUtils.message = {}
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
  getService = async () => {

    let result = await reqMyMessage(storageUtils.getUser().email);
  //  const response = JSON.stringify(result.data);
    const user = JSON.parse(result.data)
    user.return_obj = user.return_obj.filter(item => item.status === 'new account' || item.status === 'new service'|| item.status === 'updated account');
    this.setState({num:user.return_obj.length})
    console.log("雪豹" + user.return_obj.length);
    // if (result.code === '100') {
    //     const { providerList, total } = result.obj;
    //     this.setState({
    //         provider: providerList,
    //         total:total
    //     })
    // }
}

componentDidMount() {
    this.getService();
}

  render() {
    const user = storageUtils.getUser()
    const { num } = this.state;
    // const user = this.props.user;
    console.log(user.username + '123');
    console.log(this.props);
    return (
      <Header style={{ background: '#fff', padding: 0 }}>
        <div className="header">
          <h2 className='header-title'>{this.getTitle()}</h2>
          <div className="header-user">

            <div className='userInfo'>
              wellcome，{user.username}
              <Button onClick={this.logout}>log out</Button>

            </div>
            <div className='infoButton'>
              <Badge
                count= {this.state.num} 
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
