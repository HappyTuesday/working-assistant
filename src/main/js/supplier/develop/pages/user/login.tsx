import React from 'react';

import { withRouter } from "react-router";
import {Form, Icon, Input, Button, Checkbox, Card, message} from 'antd';
import { connect } from "react-redux";
import {updateAccount} from "../../redux/actions";
import {request} from "../../../../request";
import {FormComponentProps} from "antd/lib/form";

const TICKET_NAME = "login-ticket";

export function clearLoginTicket() {
    localStorage.setItem(TICKET_NAME, "");
}

@connect(null, {updateAccount})
class LoginForm extends React.Component<FormComponentProps & {updateAccount, history}> {

    state = {
        loading: true
    };

    componentDidMount(): void {
        this.loginByTicket();
    }

    loginByTicket() {
        let ticket = localStorage.getItem(TICKET_NAME);
        if (ticket) {
            request({
                url: "/api/supplier/develop/users/login/ticket",
                method: 'POST',
                params: {ticket}
            }, result => {
                this.processLoginResult(result, true);
            })
        } else {
            this.setState({loading: false})
        }
    }

    login(name: string, password: string) {
        request({
            url: "/api/supplier/develop/users/login",
            method: 'POST',
            params: {name, password}
        }, result => {
            this.processLoginResult(result, false);
        })
    }

    processLoginResult(loginResult, autoLogin) {
        localStorage.setItem(TICKET_NAME, "");

        this.setState({
            loading: false
        });

        if (loginResult && loginResult.user) {
            if (loginResult.ticket) {
                localStorage.setItem(TICKET_NAME, loginResult.ticket);
            }
            this.props.updateAccount(loginResult.user);
        } else {
            message.error(autoLogin ? "自动登录失败，请输入用户名和密码登录！" : "登录失败，请确认用户名和密码并重新登录！");
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.login(values.name, values.password);
            }
        });
    };

    render() {
        let {loading} = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <Card title="登录" loading={loading}>
                <Form onSubmit={this.handleSubmit} className="login-form" style={{maxWidth: "300px"}}>
                    <Form.Item>
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="用户名"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="登录密码"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(<Checkbox>记住我</Checkbox>)}
                        <a className="login-form-forgot" href="">
                            忘记密码？
                        </a>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" icon="login">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        );
    }
}

const WrappedNormalLoginForm = Form.create({ name: 'login' })(LoginForm);

export class LoginPage extends React.Component {
    render() {
        return (
            <WrappedNormalLoginForm/>
        )
    }
}