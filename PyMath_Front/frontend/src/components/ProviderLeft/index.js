import React, { Component } from 'react'
import { Redirect, Link, withRouter } from 'react-router-dom';
import Logo from '../../assets/images/logo192.png';
import { Breadcrumb, Layout, Menu } from 'antd';
import './index.css'


const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}


class LeftNav extends Component {
    render() {
        console.log(this.props);
        let defaultkey = this.props.location.pathname;
        console.log(defaultkey);

        return (
            <Sider trigger={null} collapsible collapsed={this.props.collapsed}>
                {/* click logo buck to the home */}
                <div className="logo">
                    <Link className='left-nav-link' to='/teacheradmin/teacherhome'>
                        <img src={Logo} alt="" />
                        <h1>find a service</h1>
                    </Link>
                </div>
                {/* menu list */}
                <Menu
                    theme="dark"
                    defaultSelectedKeys={defaultkey}
                    mode="inline"
                >
                    <Menu.Item key="/teacheradmin/teacherhome">
                        Question List
                        <Link to='/teacheradmin/teacherhome'></Link>
                    </Menu.Item>
                    <Menu.Item key="/teacheradmin/teacherinfo">
                        Personal Profile
                        <Link to='/teacheradmin/teacherinfo'></Link>
                    </Menu.Item>
                </Menu>
            </Sider>

        )
    }
}
export default withRouter(LeftNav);