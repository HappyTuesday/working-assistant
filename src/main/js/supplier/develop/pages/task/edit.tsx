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
    taskId: number;
    updateTask?: any;
}

@withRouter
class EditForm extends React.Component<EditFormProps & {history}, any> {

    state = {
        loading: true,
        task: {} as any
    };

    componentDidMount(): void {
        this.fetchTask(this.props.taskId);
    }

    fetchTask(id) {
        request({
            url: "/api/supplier/develop/tasks/" + id
        }, task => {
            this.setState({
                loading: false,
                task: task
            })
        })
    }

    updateTask(task) {
        request({
            url: "/api/supplier/develop/tasks",
            method: "POST",
            params: task
        }, () => {
            notification.info({
                message: 'Updated Successfully',
                description: "Task has been updated!"
            });

            this.props.history.push("/supplier/develop/tasks");
        });
    }

    handleSubmit = e => {
        e.preventDefault();

        let {loading, task} = this.state;
        if (loading) {
            return;
        }

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.updateTask({...task, ...values});
            }
        });
    };

    renderForm() {
        const { getFieldDecorator } = this.props.form;
        const { task } = this.state;

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
                        initialValue: task.owner,
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
                        initialValue: task.company,
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
                        initialValue: task.type,
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
                        initialValue: task.subtype,
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
                        initialValue: task.desc,
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

export class EditTaskPage extends React.Component<{match}> {
    render() {
        return (
            <div>
                <h2>Edit Task</h2>
                <WrappedEditForm taskId={this.props.match.params.taskId}/>
            </div>
        )
    }
}