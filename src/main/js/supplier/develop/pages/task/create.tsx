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
                this.createTask(values);
            }
        });
    };

    createTask(task) {
        request({
            url: "/api/supplier/develop/tasks",
            method: "PUT",
            params: task
        }, () => {
            notification.info({
                message: 'Created Successfully',
                description: "Task has been created!"
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
                <Form.Item label="owner">
                    {getFieldDecorator('owner', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input the owner!',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="company">
                    {getFieldDecorator('company', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input the company!',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="type">
                    {getFieldDecorator('type', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input the type!',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="subtype">
                    {getFieldDecorator('subtype', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input the subtype!',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="desc">
                    {getFieldDecorator('desc', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input the desc!',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Create
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedCreateForm = Form.create({})(CreateForm);

export class CreateTaskPage extends React.Component {
    render() {
        return (
            <div>
                <h2>Create Task</h2>
                <WrappedCreateForm/>
            </div>
        )
    }
}