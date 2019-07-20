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
        includingFinishedTasks: false
    };

    componentDidMount(): void {
        this.fetchTasks();
    }

    fetchTasks() {
        let {loginAccount: {username}} = this.props;
        let params = ["owner=" + username];
        if (!this.state.includingFinishedTasks) {
            params.push("done=false")
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
            title: "Name",
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
            title: 'company',
            dataIndex: 'company',
            key: 'company'
        }, {
            title: 'type',
            dataIndex: 'type',
            key: 'type'
        }, {
            title: 'subtype',
            dataIndex: 'subtype',
            key: 'subtype'
        }, {
            title: 'desc',
            dataIndex: 'desc',
            key: 'desc'
        }, {
            title: 'yesterday status',
            dataIndex: 'statusOfYesterday',
            key: 'statusOfYesterday',
            render: p => p && <ProgressLabel progress={p}/>
        }, {
            title: 'current status',
            dataIndex: 'statusOfToday',
            key: 'statusOfToday',
            render: p => p && <ProgressLabel progress={p}/>
        }
    ];

    toggleIncludingFinishedTasks = () => {
        this.setState({
            loading: true,
            includingFinishedTasks: !this.state.includingFinishedTasks
        });
        this.fetchTasks();
    };

    render() {
        return (
            <div>
                <h2>Tasks</h2>
                <div>
                    <Link to="/supplier/develop/tasks/create">
                        <Button type="primary" style={{ marginBottom: 16 }}>
                            Create
                        </Button>
                    </Link>
                    <span>
                        Including finished tasks
                        <Switch
                            defaultChecked={this.state.includingFinishedTasks}
                            onChange={this.toggleIncludingFinishedTasks}
                        />
                    </span>
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

