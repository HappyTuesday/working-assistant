import React from 'react';
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import {Checkbox, message, Skeleton} from "antd";
import {request} from "../../../../request";
import { connect } from "react-redux";

import {
    Form,
    Input,
    Button,
} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import {UserSelect} from "../user";

interface EditFormProps extends FormComponentProps {
    taskId: number;
    updateTask?: any;
}

@connect(
    state => ({
        loginAccount: state.accounts.loginAccount
    })
)
@withRouter
class EditForm extends React.Component<EditFormProps & {history, loginAccount}, any> {

    state = {
        task: null
    };

    componentDidMount(): void {
        this.fetchTask(this.props.taskId);
    }

    fetchTask(id) {
        request({
            url: "/api/supplier/develop/tasks/" + id
        }, task => {
            this.setState({
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
            message.info(`任务#${task.id}信息更新成功！`);

            let {loginAccount} = this.props;
            if (loginAccount.manager) {
                this.props.history.push("/supplier/develop/tasks/manage");
            } else {
                this.props.history.push("/supplier/develop/tasks/list");
            }
        });
    }

    handleSubmit = e => {
        e.preventDefault();

        let {task} = this.state;
        if (!task) {
            return;
        }

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.updateTask({
                    ...values,
                    id: task.id,
                    owner: {name: values.owner.value || task.owner.name}
                });
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
                <Form.Item label="责任人">
                    {getFieldDecorator('owner', {
                        initialValue: task.owner.name,
                        rules: [
                            {
                                required: true,
                                message: 'Please input the owner Name!',
                            },
                        ],
                    })(<UserSelect/>)}
                </Form.Item>
                <Form.Item label="供应商">
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
                <Form.Item label="任务类型">
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
                <Form.Item label="任务子类型">
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
                <Form.Item label="任务描述">
                    {getFieldDecorator('description', {
                        initialValue: task.description,
                        rules: [
                            {
                                required: true,
                                message: 'Please input the description!',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="任务是否已完成">
                    {getFieldDecorator('done', {
                        initialValue: task.done
                    })(<Checkbox defaultChecked={task.done}/>)}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" icon="save">
                        保存
                    </Button>
                </Form.Item>
            </Form>
        );
    }

    render() {
        return (
            <Skeleton loading={!this.state.task}>
                {this.state.task && this.renderForm()}
            </Skeleton>
        )
    }
}

const WrappedEditForm = Form.create<EditFormProps>({})(EditForm);

export class EditTaskPage extends React.Component<{match}> {
    render() {
        let taskId = this.props.match.params.taskId;
        return (
            <div>
                <h2>编辑任务 #{taskId}</h2>
                <WrappedEditForm taskId={taskId}/>
            </div>
        )
    }
}