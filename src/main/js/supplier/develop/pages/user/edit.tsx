import React from 'react';
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import {notification, Skeleton} from "antd";
import {request} from "../../../../request";

import {
    Form,
    Input,
    Button,
} from 'antd';
import {FormComponentProps} from "antd/lib/form";

interface EditFormProps extends FormComponentProps {
    userId: number;
    updateUser?: any;
}

@withRouter
class EditForm extends React.Component<EditFormProps & {history}, any> {

    state = {
        loading: true,
        user: {} as any
    };

    componentDidMount(): void {
        this.fetchUser(this.props.userId);
    }

    fetchUser(id) {
        request({
            url: "/api/supplier/develop/users/" + id
        }, user => {
            this.setState({
                loading: false,
                user: user
            })
        })
    }

    updateUser(user) {
        request({
            url: "/api/supplier/develop/users",
            method: "POST",
            params: user
        }, () => {
            notification.info({
                message: 'Updated Successfully',
                description: "User has been updated!"
            });

            this.props.history.push("/supplier/develop/users/list");
        });
    }

    handleSubmit = e => {
        e.preventDefault();

        let {loading, user} = this.state;
        if (loading) {
            return;
        }

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.updateUser({...user, ...values});
            }
        });
    };

    renderForm() {
        const { getFieldDecorator } = this.props.form;
        const { user } = this.state;

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
                <Form.Item label="User Name">
                    {getFieldDecorator('username', {
                        initialValue: user.username,
                        rules: [
                            {
                                required: true,
                                message: 'Please input the username!',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="Password">
                    {getFieldDecorator('password', {
                        initialValue: user.password,
                        rules: [
                            {
                                required: true,
                                message: 'Please input the password!',
                            },
                        ],
                    })(<Input type="password" />)}
                </Form.Item>
                <Form.Item label="manager">
                    {getFieldDecorator('manager', {
                        initialValue: user.manager
                    })(<Input type="checkbox" />)}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form.Item>
            </Form>
        );
    }

    render() {
        return (
            <Skeleton active={true} loading={this.state.loading}>
                {this.renderForm()}
            </Skeleton>
        )
    }
}

const WrappedEditForm = Form.create<EditFormProps>({})(EditForm);

export class EditUserPage extends React.Component<{match}> {
    render() {
        return (
            <div>
                <h2>Edit User</h2>
                <WrappedEditForm userId={this.props.match.params.userId}/>
            </div>
        )
    }
}