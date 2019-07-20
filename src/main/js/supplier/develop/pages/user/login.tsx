import React from 'react';

import { withRouter } from "react-router";
import {Form, Icon, Input, Button, Checkbox, Card} from 'antd';
import { connect } from "react-redux";
import {updateAccount} from "../../redux/actions";
import {request} from "../../../../request";
import {FormComponentProps} from "antd/lib/form";

@connect(null, {updateAccount})
class LoginForm extends React.Component<FormComponentProps & {updateAccount, history}> {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.login(values.username, values.password);
            }
        });
    };

    login(username: string, password: string) {
        request({
            url: "/api/supplier/develop/users/login",
            method: 'POST',
            params: {username, password}
        }, user => {
            this.props.updateAccount(user);
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Card title="login">
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Username"
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
                                placeholder="Password"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(<Checkbox>Remember me</Checkbox>)}
                        <a className="login-form-forgot" href="">
                            Forgot password
                        </a>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
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