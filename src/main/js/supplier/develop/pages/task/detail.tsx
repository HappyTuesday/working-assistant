import React from "react";
import {Button, Descriptions, Divider, Drawer, Form, Input, notification, Skeleton, Steps} from "antd";
import {request} from "../../../../request";
import { connect } from "react-redux";
import {FormComponentProps} from "antd/lib/form";
import dateFormat from "dateformat"

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
        request({
            url: "/api/supplier/develop/tasks/progress/" + this.props.taskId,
            method: "PUT",
            params: {
                content,
                comment,
                author: this.props.loginAccount.username
            }
        }, () => {
            notification.info({
                message: 'Updated Successfully',
                description: "Task has been updated!"
            });

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
                <Form.Item label="Content">
                    {getFieldDecorator('content', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input the content of the progress!',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="Comment">
                    {getFieldDecorator('comment')(<Input.TextArea />)}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Commit
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
                key={"" + p.timestamp}
                title={`[${dateFormat(p.timestamp, "yyyy/mm/dd hh:MM")}] ${p.content}`}
                description={
                    <span>
                         <span style={{color: "rgba(0,0,0,0.45", marginRight: "1em"}}>@{p.author}</span>
                         <span>{p.comment}</span>
                    </span>
                }
            />
        )).reverse();

        return (
            <Steps direction="vertical" size="small" current={steps.length}>
                {steps}
            </Steps>
        )
    }

    renderDetail() {
        let {detail: {task}} = this.state;

        let form;
        if (!task.done) {
            form = <WrappedProgressForm taskId={task.id} onCommitted={() => this.fetchTaskDetail()}/>
        }

        let {size} = this.props;

        return (
            <div>
                <Descriptions title={`Task #${task.id}`} column={size === 'small' ? 1 : 3} layout="horizontal">
                    <Descriptions.Item label="Owner">{task.owner}</Descriptions.Item>
                    <Descriptions.Item label="company">{task.company}</Descriptions.Item>
                    <Descriptions.Item label="type">{task.type}</Descriptions.Item>
                    <Descriptions.Item label="subtype">{task.subtype}</Descriptions.Item>
                    <Descriptions.Item label="desc">{task.desc}</Descriptions.Item>
                    <Descriptions.Item label="done">{task.done}</Descriptions.Item>
                </Descriptions>
                {this.renderHistory()}
                {form && <Divider/>}
                {form}
            </div>
        )
    }

    render() {
        let {detail} = this.state;
        return (
            <Skeleton active={true} loading={!detail}>
                {detail && this.renderDetail()}
            </Skeleton>
        )
    }
}

export class TaskDetailPage extends React.Component<{match}> {
    render() {
        return (
            <div>
                <h2>Task Detail</h2>
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
                    title="Task Detail"
                    width={400}
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
            showDrawer => <a onClick={showDrawer}>{this.props.children}</a>
        }/>
    }
}