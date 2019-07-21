import React from 'react'
import { Link } from "react-router-dom";
import {Table, Button, Switch} from "antd";
import {request} from "../../../../request";
import { connect } from "react-redux";
import {TaskDetailDrawerLink} from "./detail";
import {ProgressLabel} from "./progress";

@connect(
    state => ({
        loginAccount: state.accounts.loginAccount
    })
)
class TaskList extends React.Component<{loginAccount?}> {

    state = {
        loading: true,
        tasks: null,
        onlyFinishedTasks: false
    };

    componentDidMount(): void {
        this.fetchTasks();
    }

    fetchTasks() {
        let {loginAccount: {name}} = this.props;
        let params = ["owner=" + name];
        if (this.state.onlyFinishedTasks) {
            params.push("done=true")
        }

        request({
            url: "/api/supplier/develop/tasks?" + params.join("&")
        }, tasks => {
            this.setState({
                loading: false,
                tasks
            })
        })
    }

    columns = [
        {
            title: "任务编号",
            dataIndex: 'id',
            key: 'id',
            render: id => (
                <TaskDetailDrawerLink
                    taskId={id}
                    onClosed={() => this.fetchTasks()}>
                    #{id}
                </TaskDetailDrawerLink>
            )
        },
        {
            title: '供应商',
            dataIndex: 'company',
            key: 'company'
        }, {
            title: '任务类型',
            dataIndex: 'type',
            key: 'type'
        }, {
            title: '任务自类型',
            dataIndex: 'subtype',
            key: 'subtype'
        }, {
            title: '任务描述',
            dataIndex: 'desc',
            key: 'desc'
        }, {
            title: '昨日进度',
            dataIndex: 'statusOfYesterday',
            key: 'statusOfYesterday',
            render: p => p && <ProgressLabel progress={p}/>
        }, {
            title: '当前进度',
            dataIndex: 'statusOfToday',
            key: 'statusOfToday',
            render: p => p && <ProgressLabel progress={p}/>
        }
    ];

    toggleOnlyFinishedTasks = checked => {
        this.setState({
            loading: true,
            onlyFinishedTasks: checked
        }, () => this.fetchTasks());
    };

    render() {
        return (
            <div>
                <h2>我的任务列表</h2>
                <div>
                    <Link to="/supplier/develop/tasks/create">
                        <Button type="primary" style={{ marginBottom: 16 }} icon="plus">
                            添加新任务
                        </Button>
                    </Link>
                    <label style={{marginLeft: "1em"}}>
                        <Switch
                            defaultChecked={this.state.onlyFinishedTasks}
                            onChange={this.toggleOnlyFinishedTasks}
                        />
                        仅已完成任务
                    </label>
                </div>
                <Table
                    loading={!this.state.tasks || this.state.loading}
                    size="middle"
                    rowKey="id"
                    dataSource={this.state.tasks}
                    columns={this.columns}
                    pagination={{size: "100"}}
                />
            </div>
        )
    }
}

export class TaskListPage extends React.Component {
    render() {
        return (
            <TaskList/>
        )
    }
}

