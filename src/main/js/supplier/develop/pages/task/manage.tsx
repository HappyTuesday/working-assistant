import React from 'react'
import { Link } from "react-router-dom";
import {Table, Button, Popconfirm, Divider, Switch, Icon} from "antd";
import {request} from "../../../../request";
import {TaskDetailDrawerLink} from "./detail";
import {ProgressLabel} from "./progress";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import dateFormat from "dateformat"
import {unique} from "../../../../lambda";

@connect(
    state => ({
        loginAccount: state.accounts.loginAccount
    })
)
class TaskManageList extends React.Component<{loginAccount?}> {

    state = {
        tasks: null,
        loading: true,
        onlyFinishedTasks: false
    };

    componentDidMount(): void {
        this.fetchTasks();
    }

    getQueryParams() {
        let params = [
            "done=" + this.state.onlyFinishedTasks
        ];
        return params.join("&");
    }

    fetchTasks() {
        request({
            url: "/api/supplier/develop/tasks?" + this.getQueryParams()
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

    getFilter(tasks, field) {
        return unique(tasks.map(t => t[field]))
            .map(t => ({text: t, value: t}))
    }

    get columns() {

        let doneTimeColumns = [];
        let {onlyFinishedTasks} = this.state;

        let {tasks = []} = this.state;

        if (onlyFinishedTasks) {
            doneTimeColumns.push(
                {
                    title: '完成时间',
                    dataIndex: 'doneTime',
                    key: 'doneTime',
                    sorter: (x, y) => x.doneTime - y.doneTime,
                    render: doneTime => dateFormat(doneTime, "yyyy/mm/dd HH:MM")
                }
            )
        }

        return [
            {
                title: "序号",
                dataIndex: 'id',
                key: 'id',
                render: (id, record, index) => (
                    <span>
                        <TaskDetailDrawerLink
                            taskId={id}
                            onClosed={() => this.fetchTasks()}>
                            {index + 1}
                        </TaskDetailDrawerLink>
                    </span>
                )
            },
            {
                title: '负责人',
                dataIndex: 'owner.name',
                key: 'owner.name',
                filters: this.getFilter(tasks, 'owner.name')
            }, {
                title: '供应商全称',
                dataIndex: 'supplierName',
                key: 'supplierName',
                filters: this.getFilter(tasks, 'supplierName')
            }, {
                title: '供应商类型',
                dataIndex: 'supplierType',
                key: 'supplierType',
                filters: this.getFilter(tasks, 'supplierType')
            }, {
                title: '任务类型',
                dataIndex: 'type',
                key: 'type',
                filters: this.getFilter(tasks, 'type')
            }, {
                title: '子类型',
                dataIndex: 'subtype',
                key: 'subtype'
            }, {
                title: '任务描述',
                dataIndex: 'description',
                key: 'description'
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
            },
            ...doneTimeColumns,
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => (
                    <div>
                        <Link to={"/supplier/develop/tasks/detail/" + record.id}>
                            <Icon type="menu-unfold" title="查看详情"/>
                        </Link>
                        {!onlyFinishedTasks && (
                            <React.Fragment>
                                <Divider type="vertical"/>
                                <Popconfirm title="Sure to finish?" onConfirm={() => this.finishTask(record.id)}>
                                    <a href="javascript:" title="将此任务标记为已完成">
                                        <Icon type="check"/>
                                    </a>
                                </Popconfirm>
                            </React.Fragment>
                        )}
                        <Divider type="vertical"/>
                        <Link to={"/supplier/develop/tasks/edit/" + record.id}>
                            <Icon type="edit" title="编辑此任务"/>
                        </Link>
                        <Divider type="vertical"/>
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteTask(record.id)}>
                            <a href="javascript:" title="删除此任务">
                                <Icon type="delete"/>
                            </a>
                        </Popconfirm>
                    </div>
                )
            }
        ];
    }

    toggleOnlyFinishedTasks = checked => {
        this.setState({
            loading: true,
            onlyFinishedTasks: checked
        }, () => this.fetchTasks());
    };

    render() {
        return (
            <div>
                <h2>任务管理</h2>
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
                    <a href={"/api/supplier/develop/tasks/excel?" + this.getQueryParams()}
                       style={{marginLeft: "1em"}}
                       title="导出"
                       download>
                        <Icon type="export" /> 导出到Excel
                    </a>
                </div>
                <Table
                    loading={!this.state.tasks || this.state.loading}
                    size="middle"
                    rowKey="id"
                    dataSource={this.state.tasks}
                    columns={this.columns}
                    pagination={{pageSize: 100}}
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