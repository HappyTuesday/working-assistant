import React from 'react'
import { Link } from "react-router-dom";
import {request} from "../../../../request";
import { connect } from "react-redux";

import {
    Form,
    Input,
    Button, message,
} from 'antd';
import {UserSelect} from "../user";
import {TASK_SUBTYPE_SELECT, TASK_TYPE_SELECT} from "../../models/task";
import {SUPPLIER_TYPE_SELECT} from "../../models/supplier";

@connect(
    state => ({
        loginAccount: state.accounts.loginAccount
    })
)
class CreateForm extends React.Component<any> {

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.createTask({...values, owner: {name: values.owner.value || this.props.loginAccount.name}});
            }
        });
    };

    createTask(task) {
        request({
            url: "/api/supplier/develop/tasks",
            method: "PUT",
            params: task
        }, taskId => {
            message.info(`任务#${taskId}创建成功！`);
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

        let {loginAccount} = this.props;

        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <Form.Item label="任务负责人">
                    {getFieldDecorator('owner', {
                        initialValue: loginAccount.manager ? "" : loginAccount.name,
                        rules: [
                            {
                                required: true,
                                message: 'Please input the owner!',
                            },
                        ],
                    })(loginAccount.manager ? <UserSelect/> : <Input readOnly={true}/>)}
                </Form.Item>
                <Form.Item label="供应商全称">
                    {getFieldDecorator('supplierName', {
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
                        rules: [
                            {
                                required: true,
                                message: 'Please input the supplier type!',
                            },
                        ],
                    })(SUPPLIER_TYPE_SELECT)}
                </Form.Item>
                <Form.Item label="任务类型">
                    {getFieldDecorator('type', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input the type!',
                            },
                        ],
                    })(TASK_TYPE_SELECT)}
                </Form.Item>
                <Form.Item label="任务子类型">
                    {getFieldDecorator('subtype', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input the subtype!',
                            },
                        ],
                    })(TASK_SUBTYPE_SELECT)}
                </Form.Item>
                <Form.Item label="任务描述">
                    {getFieldDecorator('description', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input the description!',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" icon="plus">
                        创建
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
                <h2>创建任务</h2>
                <WrappedCreateForm/>
            </div>
        )
    }
}