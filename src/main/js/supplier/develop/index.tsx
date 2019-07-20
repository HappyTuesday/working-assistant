import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {Icon, Layout, Menu, PageHeader} from 'antd';
import { Provider } from "react-redux";

import { withRouter } from "react-router";
import { connect } from "react-redux";
import store from "./redux/store";
import {TaskListPage} from "./pages/task/tasks";
import {CreateTaskPage} from "./pages/task/create";

import {EditTaskPage} from "./pages/task/edit";
import {NotFound} from "../../404";
import {LoginPage} from "./pages/user/login";
const { Footer } = Layout;

import { Avatar } from 'antd';
import {updateAccount} from "./redux/actions";
import {User} from "./models/User";
import {IndexPage} from "./pages";
import {UserListPage} from "./pages/user";
import {CreateUserPage} from "./pages/user/create";
import {EditUserPage} from "./pages/user/edit";
import {TaskManageListPage} from "./pages/task/manage";
import {TaskDetailPage} from "./pages/task/detail";
const { Header, Content, Sider } = Layout;

@connect(
    state => ({
        loginAccount: state.accounts.loginAccount
    }),
    {updateAccount}
)
@withRouter
class BasicLayout extends React.Component<{loginAccount?: User, updateAccount?, history?}> {

    state = {
        collapsed: false,
    };

    logout() {
        this.props.updateAccount(null)
    }

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    navTo(link: string) {
        this.props.history.push(link)
    }

    renderMenuItem({key, title, link}) {
        return (
            <Menu.Item key={key} onClick={() => this.navTo(link)}>
                <Icon type="schedule" />
                <span>{title}</span>
            </Menu.Item>
        )
    }

    render() {
        let {loginAccount} = this.props;

        let menuItems = [];

        if (loginAccount) {
            if (loginAccount.manager) {
                menuItems.push(this.renderMenuItem({
                    key: "1",
                    title: "Tasks",
                    link: "/supplier/develop/tasks/manage"
                }));

                menuItems.push(this.renderMenuItem({
                    key: "2",
                    title: "Users",
                    link: "/supplier/develop/users/list"
                }));
            } else {
                menuItems.push(this.renderMenuItem({
                    key: "1",
                    title: "Tasks",
                    link: "/supplier/develop/tasks/list"
                }));
            }
        }

        let userInfo = loginAccount && (
            <span key="user-info">
                <Avatar
                    size="small"
                    icon="user"
                    alt="avatar"
                    style={{ backgroundColor: '#42cbd0' }}
                />
                <a onClick={() => this.logout()} style={{ paddingLeft: "1em"}} title="log out">
                    {loginAccount.username}
                </a>
            </span>
        );

        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <div className="logo" />
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">{menuItems}</Menu>
                </Sider>
                <Layout>
                    <Header style={{ padding: '0 50px 0 0', backgroundColor: "#f0f2f5" }}>
                        <PageHeader
                            onBack={() => window.history.back()}
                            title="Working Assistant"
                            subTitle="Supplier Develop - Enjoy your life!"
                            extra={[userInfo]}
                        />
                    </Header>
                    <Content style={{padding: '0 50px'}}>
                        <div style={{background: '#fff', padding: 24, minHeight: 580}}>
                            <Switch>
                                {!loginAccount && <Route component={LoginPage}/>}
                                <Route path="/supplier/develop" exact component={IndexPage}/>

                                <Route path="/supplier/develop/tasks/list" component={TaskListPage}/>
                                <Route path="/supplier/develop/tasks/manage" component={TaskManageListPage}/>
                                <Route path="/supplier/develop/tasks/detail/:taskId" component={TaskDetailPage}/>
                                <Route path="/supplier/develop/tasks/create" component={CreateTaskPage}/>
                                <Route path="/supplier/develop/tasks/edit/:taskId" component={EditTaskPage}/>

                                <Route path="/supplier/develop/users/list" component={UserListPage}/>
                                <Route path="/supplier/develop/users/create" component={CreateUserPage}/>
                                <Route path="/supplier/develop/users/edit/:userId" component={EditUserPage}/>

                                <Route component={NotFound}/>
                            </Switch>
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>Working Assistant ©2019 Created by Nick</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default class Index extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <BasicLayout/>
                </Router>
            </Provider>
        )
    }
}