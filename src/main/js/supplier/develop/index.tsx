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
import {clearLoginTicket, LoginPage} from "./pages/user/login";
const { Footer } = Layout;

import { Avatar } from 'antd';
import {updateAccount} from "./redux/actions";
import {User} from "./models/user";
import {UserListPage} from "./pages/user";
import {CreateUserPage} from "./pages/user/create";
import {EditUserPage} from "./pages/user/edit";
import {TaskManageListPage} from "./pages/task/manage";
import {TaskDetailPage} from "./pages/task/detail";
const { Header, Content, Sider } = Layout;

@withRouter
class NotFound extends React.Component<{location?}> {
    render() {
        return (
            <div>
                <h2>
                    <span style={{marginRight: "1em"}}><Icon type="frown" /></span>
                    找不到你要访问的资源（{this.props.location.pathname}）!
                </h2>
                <p>
                    确认你输入的网站，或者<Link to="/supplier/develop">回到主页</Link>
                </p>
            </div>
        )
    }
}

@connect(
    state => ({
        loginAccount: state.accounts.loginAccount
    }),
    {updateAccount}
)
@withRouter
class BasicLayout extends React.Component<{loginAccount?: User, updateAccount?, history?}> {

    state = {
        collapsed: true,
    };

    logout() {
        clearLoginTicket();
        this.props.updateAccount(null)
    }

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({collapsed});
    };

    navTo(link: string) {
        this.props.history.push(link)
    }

    renderMenuItem({key, title, link, icon}) {
        return (
            <Menu.Item key={key} onClick={() => this.navTo(link)}>
                <Icon type={icon}/>
                <span>{title}</span>
            </Menu.Item>
        )
    }

    render() {
        let {loginAccount} = this.props;

        let menuItems = [];

        if (loginAccount) {
            menuItems.push(this.renderMenuItem({
                key: "1",
                title: "我的任务",
                link: "/supplier/develop/tasks/list",
                icon: "schedule"
            }));

            if (loginAccount.manager) {
                menuItems.push(this.renderMenuItem({
                    key: "2",
                    title: "任务管理",
                    link: "/supplier/develop/tasks/manage",
                    icon: "database"
                }));

                menuItems.push(this.renderMenuItem({
                    key: "3",
                    title: "用户管理",
                    link: "/supplier/develop/users/list",
                    icon: "user"
                }));
            }
        }

        let userInfo = loginAccount && (
            <span key="user-info">
                <Avatar
                    size="small"
                    icon="user"
                    alt="avatar"
                    style={{backgroundColor: '#42cbd0'}}
                />
                <span style={{padding: "0 1em 0 0.3em"}}>
                    Welcome {loginAccount.name}
                </span>
                <a onClick={() => this.logout()} title="注销登录">
                    <Icon type="logout" />
                </a>
            </span>
        );

        let routes = [];
        if (loginAccount) {
            routes.push(
                <Route path="/supplier/develop" key="1" exact component={TaskListPage}/>,
                <Route path="/supplier/develop/tasks" key="2" exact component={TaskListPage}/>,
                <Route path="/supplier/develop/tasks/list" key="3" component={TaskListPage}/>,
                <Route path="/supplier/develop/tasks/create" key="6" component={CreateTaskPage}/>
            );

            if (loginAccount.manager) {
                routes.push(
                    <Route path="/supplier/develop/tasks/manage" key="4" component={TaskManageListPage}/>,
                    <Route path="/supplier/develop/tasks/detail/:taskId" key="5" component={TaskDetailPage}/>,
                    <Route path="/supplier/develop/tasks/edit/:taskId" key="7" component={EditTaskPage}/>,
                    <Route path="/supplier/develop/users/list" key="8" component={UserListPage}/>,
                    <Route path="/supplier/develop/users/create" key="9" component={CreateUserPage}/>,
                    <Route path="/supplier/develop/users/edit/:userId" key="10" component={EditUserPage}/>
                )
            }
        } else {
            routes.push(
                <Route key="11" component={LoginPage}/>
            )
        }

        routes.push(<Route key="12" component={NotFound}/>);

        return (
            <Layout style={{minHeight: '100vh'}}>
                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <div className="logo"/>
                    <Menu theme="dark" defaultSelectedKeys={[]} mode="inline">{menuItems}</Menu>
                </Sider>
                <Layout>
                    <Header style={{padding: '0 50px 0 0', backgroundColor: "#f0f2f5"}}>
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
                                {routes}
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