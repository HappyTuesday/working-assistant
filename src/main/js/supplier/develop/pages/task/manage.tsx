import React from 'react'
import { Link } from "react-router-dom";
import {Table, Button, Popconfirm, Divider, Switch, Icon} from "antd";
import {request} from "../../../../request";
import {TaskDetailDrawerLink} from "./detail";
import {ProgressLabel} from "./progress";
import { connect } from "react-redux";
import { withRouter } from "react-router";

@connect(
    state => ({
        loginAccount: state.accounts.loginAccount
    })
)
@withRouter
class TaskManageList extends React.Component<{loginAccount?, history?}> {

    state = {
        tasks: null,
        loading: true,
        includingFinishedTasks: false
    };

    componentDidMount(): void {
        let {loginAccount, history} = this.props;
        if (!loginAccount.manager) {
            history.replace("/supplier/develop/tasks/list")
        }
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
            title: '负责人',
            dataIndex: 'owner.name',
            key: 'owner',
            editable: true,
        }, {
            title: '供应商',
            dataIndex: 'company',
            key: 'company'
        }, {
            title: '任务类型',
            dataIndex: 'type',
            key: 'type'
        }, {
            title: '自类型',
            dataIndex: 'subtype',
            key: 'subtype'
        }, {
            title: '任务描述',
            dataIndex: 'desc',
            key: 'desc'
        }, {
            title: '是否已完成',
            dataIndex: 'done',
            key: 'done',
            render: done => done && <Icon type="check" />
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
        }, {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => (
                <div>
                    <Link to={"/supplier/develop/tasks/edit/" + record.id}>编辑</Link>
                    <Divider type="vertical"/>
                    <Link to={"/supplier/develop/tasks/detail/" + record.id}>详情</Link>
                    <Divider type="vertical"/>
                    <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteTask(record.id)}>
                        <a href="javascript:">删除</a>
                    </Popconfirm>
                    <Divider type="vertical"/>
                    <Popconfirm title="Sure to finish?" onConfirm={() => this.finishTask(record.id)}>
                        <a href="javascript:">标为已完成</a>
                    </Popconfirm>
                </div>
            )
        }
    ];

    toggleIncludingFinishedTasks = checked => {
        this.setState({
            loading: true,
            includingFinishedTasks: checked
        }, () => this.fetchTasks());
    };

    render() {
        return (
            <div>
                <h2>任务管理</h2>
                <div>
                    <Link to="/supplier/develop/tasks/create">
                        <Button type="primary" style={{ marginBottom: 16 }}>
                            添加新任务
                        </Button>
                    </Link>
                    <label style={{marginLeft: "1em"}}>
                        <Switch
                            defaultChecked={this.state.includingFinishedTasks}
                            onChange={this.toggleIncludingFinishedTasks}
                        />
                        包含已完成任务
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

export class TaskManageListPage extends React.Component {
    render() {
        return (
            <TaskManageList/>
        )
    }
}