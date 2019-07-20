import React from 'react'
import { Link } from "react-router-dom";
import {Table, Button, Popconfirm, Divider, Switch} from "antd";
import {request} from "../../../../request";
import {TaskDetailDrawerLink} from "./detail";
import {ProgressLabel} from "./progress";

class TaskManageList extends React.Component {

    state = {
        tasks: null,
        loading: true,
        includingFinishedTasks: false
    };

    componentDidMount(): void {
        this.fetchTasks();
    }

    fetchTasks() {
        let params = [];
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

    deleteTask(id) {
        this.setState({loading: true});

        request({
            url: "/api/supplier/develop/tasks/" + id,
            method: "DELETE"
        }, () => {
            this.fetchTasks()
        });
    }

    finishTask(id) {
        this.setState({loading: true});

        request({
            url: "/api/supplier/develop/tasks/finish/" + id,
            method: "POST"
        }, () => {
            this.fetchTasks()
        });
    }

    columns = [
        {
            title: "Name",
            dataIndex: 'id',
            key: 'id',
            render: id => <TaskDetailDrawerLink taskId={id}>#{id}</TaskDetailDrawerLink>
        },
        {
            title: 'owner',
            dataIndex: 'owner',
            key: 'owner',
            editable: true,
        }, {
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
            title: 'done',
            dataIndex: 'done',
            key: 'done'
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
        }, {
            title: 'operation',
            dataIndex: 'operation',
            render: (text, record) => (
                <div>
                    <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteTask(record.id)}>
                        <a href="javascript:">Delete</a>
                    </Popconfirm>
                    <Divider type="vertical"/>
                    <Link to={"/supplier/develop/tasks/edit/" + record.id}>Edit</Link>
                    <Divider type="vertical"/>
                    <Link to={"/supplier/develop/tasks/detail/" + record.id}>Detail</Link>
                    <Divider type="vertical"/>
                    <a onClick={() => this.finishTask(record.id)}>Finish</a>
                </div>
            )
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

export class TaskManageListPage extends React.Component {
    render() {
        return (
            <TaskManageList/>
        )
    }
}