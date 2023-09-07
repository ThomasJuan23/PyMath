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
                <div className="logo">
                    <Link className='left-nav-link' to='/admin/adminhome'>
                        <img src={Logo} alt="" />
                        <h1>PyMath</h1>
                    </Link>
                </div>

                <Menu
                    theme="dark"
                    defaultSelectedKeys={defaultkey}
                    mode="inline"
                >
                    <Menu.Item key="/admin/adminhome">
                        <Link to='/admin/adminhome'></Link>
                        Question Management
                    </Menu.Item>
                    <Menu.Item key="/admin/usermanage">
                        User Management
                        <Link to='/admin/usermanage'></Link>
                    </Menu.Item>
                </Menu>
            </Sider>

        )
    }
}
export default withRouter(LeftNav);