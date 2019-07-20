import React from 'react'
import { Link } from "react-router-dom";
import { notification } from "antd";
import {request} from "../../../../request";

import {
    Form,
    Input,
    Button,
} from 'antd';

class CreateForm extends React.Component<any> {

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.createUser(values);
            }
        });
    };

    createUser(user) {
        request({
            url: "/api/supplier/develop/users",
            method: "PUT",
            params: user
        }, () => {
            notification.info({
                message: 'Created Successfully',
                description: "User has been created!"
            });
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label="用户名">
                    {getFieldDecorator('name', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input the name!',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="登录密码">
                    {getFieldDecorator('password', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input the password!',
                            },
                        ],
                    })(<Input type="password" />)}
                </Form.Item>
                <Form.Item label="是否为管理员">
                    {getFieldDecorator('manager', {
                        initialValue: false,
                    })(<Input type="checkbox" />)}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        创建
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedCreateForm = Form.create({})(CreateForm);

export class CreateUserPage extends React.Component {
    render() {
        return (
            <div>
                <h2>创建用户</h2>
                <WrappedCreateForm/>
            </div>
        )
    }
}