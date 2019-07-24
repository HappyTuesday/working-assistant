import React from 'react';
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import {Radio, message, Skeleton} from "antd";
import {request} from "../../../../request";
import { connect } from "react-redux";

import {
    Form,
    Input,
    Button,
} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import {UserSelect} from "../user";
import {renderTaskStatusRadio, TASK_SUBTYPE_SELECT, TASK_TYPE_SELECT, TaskStatus} from "../../models/task";
import {SUPPLIER_TYPE_SELECT} from "../../models/supplier";

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
                <Form.Item label="供应商全称">
                    {getFieldDecorator('supplierName', {
                        initialValue: task.supplierName,
                        rules: [
                            {
                                required: true,
                                message: 'Please input the supplier name!',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="供应商类型">
                    {getFieldDecorator('supplierType', {
                        initialValue: task.supplierType,
                        rules: [
                            {
                                required: true,
                                message: 'Please input the supplier type!',
                            },
                        ],
                    })(SUPPLIER_TYPE_SELECT)}
                </Form.Item>
                <Form.Item label="品类">
                    {getFieldDecorator('subtype', {
                        initialValue: task.subtype,
                        rules: [
                            {
                                required: true,
                                message: 'Please input the subtype!',
                            },
                        ],
                    })(TASK_SUBTYPE_SELECT)}
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
                    })(TASK_TYPE_SELECT)}
                </Form.Item>
                <Form.Item label="备注">
                    {getFieldDecorator('description', {
                        initialValue: task.description,
                        rules: [],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="任务状态">
                    {getFieldDecorator('taskStatus', {
                        initialValue: task.taskStatus
                    })(renderTaskStatusRadio())}
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
                <h2>编辑任务</h2>
                <WrappedEditForm taskId={taskId}/>
            </div>
        )
    }
}