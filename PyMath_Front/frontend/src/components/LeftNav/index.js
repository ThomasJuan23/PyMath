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
        let defaultkey = this.props.location.pathname;
        return (
            <Sider trigger={null} collapsible collapsed={this.props.collapsed}>
                {/* click logo back to the home */}
                <div className="logo">
                    <Link className='left-nav-link' to='/useradmin/userhome'>
                        <img src={Logo} alt="" />
                        <h1>PyMath</h1>
                    </Link>
                </div>
                {/* menu list */}
                <Menu
                    theme="dark"
                    defaultSelectedKeys={defaultkey}
                    mode="vertical"
                >
                    <Menu.Item key="/useradmin/userhome">
                        <Link to='/useradmin/userhome'></Link>
                        Question List
                    </Menu.Item>
                    <Menu.Item key="/useradmin/userinfo">
                        Personal Profile
                        <Link to="/useradmin/userinfo"></Link>
                    </Menu.Item>
                    <Menu.Item key="/useradmin/history">
                        Answer History
                        <Link to="/useradmin/history"></Link>
                    </Menu.Item>
                </Menu>
            </Sider>

        )
    }
}
export default withRouter(LeftNav);