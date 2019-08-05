import React from "react";
import {Button, Descriptions, Divider, Drawer, Form, Input, message, Skeleton, Steps} from "antd";
import {request} from "../../../../request";
import { connect } from "react-redux";
import {FormComponentProps} from "antd/lib/form";
import dateFormat from "dateformat"
import {showTaskStatus, showTransitTimeTitle, TaskStatus} from "../../models/task";

const { Step } = Steps;

@connect(
    state => ({
        loginAccount: state.accounts.loginAccount
    })
)
class ProgressForm extends React.Component<FormComponentProps & {taskId?, loginAccount?, onCommitted?}> {

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.updateProcess(values.content, values.comment);
            }
        })
    };

    updateProcess(content, comment) {
        let taskId = this.props.taskId;
        request({
            url: "/api/supplier/develop/tasks/progress/" + taskId,
            method: "PUT",
            params: {
                content,
                comment,
                author: this.props.loginAccount.name
            }
        }, () => {
            message.info("进度汇报成功");

            let {onCommitted} = this.props;
            if (onCommitted) {
                onCommitted();
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit} title="Update Progress">
                <Form.Item label="进度">
                    {getFieldDecorator('content', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input the content of the progress!',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="备注">
                    {getFieldDecorator('comment')(<Input.TextArea />)}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" icon="save">
                        提交进度
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}

let WrappedProgressForm = Form.create<any>({})(ProgressForm);

class TaskDetail extends React.Component<{taskId, size?}> {
    state = {
        detail: null
    };

    componentDidMount(): void {
        this.fetchTaskDetail();
    }

    fetchTaskDetail() {
        request({
            url: "/api/supplier/develop/tasks/detail/" + this.props.taskId
        }, detail => {
            this.setState({
                detail: detail
            })
        })
    }

    renderHistory() {
        let {detail: {history}} = this.state;

        let steps = history.map(p => (
            <Step
                key={p.id}
                title={`[${dateFormat(p.timestamp, "yyyy/mm/dd HH:MM")}] ${p.content}`}
                description={
                    <span>
                         <span style={{color: "rgba(0,0,0,0.45", marginRight: "1em"}}>@{p.author.name}</span>
                         <span>{p.comment}</span>
                    </span>
                }
            />
        ));

        return (
            <Steps direction="vertical" size="small" current={steps.length}>
                {steps}
            </Steps>
        )
    }

    renderDetail() {
        let {detail: {task}} = this.state;

        let form;
        if (task.taskStatus === TaskStatus.ACTIVE) {
            form = <WrappedProgressForm taskId={task.id} onCommitted={() => this.fetchTaskDetail()}/>
        }

        return (
            <div>
                <Descriptions column={1} layout="horizontal">
                    <Descriptions.Item label="负责人">{task.owner.name}</Descriptions.Item>
                    <Descriptions.Item label="供应商全称">{task.supplierName}</Descriptions.Item>
                    <Descriptions.Item label="供应商类型">{task.supplierType}</Descriptions.Item>
                    <Descriptions.Item label="品类">{task.subtype}</Descriptions.Item>
                    <Descriptions.Item label="任务类型">{task.type}</Descriptions.Item>
                    <Descriptions.Item label="备注">{task.description}</Descriptions.Item>
                    <Descriptions.Item label="任务状态">{showTaskStatus(task.taskStatus)}</Descriptions.Item>
                    <Descriptions.Item label={showTransitTimeTitle(task.taskStatus)}>
                        {dateFormat(task.transitTime, "yyyy/mm/dd HH:MM")}
                    </Descriptions.Item>
                </Descriptions>
                {form}
                {form && <Divider/>}
                {this.renderHistory()}
            </div>
        )
    }

    render() {
        let {detail} = this.state;
        return (
            <Skeleton loading={!detail}>
                {detail && this.renderDetail()}
            </Skeleton>
        )
    }
}

export class TaskDetailPage extends React.Component<{match}> {
    render() {
        return (
            <div>
                <h2>任务详情</h2>
                <TaskDetail taskId={this.props.match.params.taskId}/>
            </div>
        )
    }
}

export class TaskDetailDrawer extends React.Component<{renderTrigger: (showDrawer) => any, taskId?, onClosed?}> {

    state = {
        visible: false
    };

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
        if (this.props.onClosed) {
            this.props.onClosed();
        }
    };

    render() {
        return (
            <div>
                {this.props.renderTrigger(this.showDrawer)}
                <Drawer
                    title="任务详情"
                    width={450}
                    onClose={this.onClose}
                    visible={this.state.visible}>
                    <TaskDetail taskId={this.props.taskId} size="small"/>
                </Drawer>
            </div>
        );
    }
}

export class TaskDetailDrawerLink extends React.Component<{taskId, onClosed?}> {
    render() {
        return <TaskDetailDrawer taskId={this.props.taskId} onClosed={this.props.onClosed} renderTrigger={
            showDrawer => <a onClick={showDrawer} title="点击查看详情">{this.props.children}</a>
        }/>
    }
}