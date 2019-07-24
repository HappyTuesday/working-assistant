import React from 'react'
import { Link } from "react-router-dom";
import {Table, Button, Switch, Input} from "antd";
import {collectRequestParams, request} from "../../../../request";
import { connect } from "react-redux";
import {TaskDetailDrawerLink} from "./detail";
import {ProgressLabel} from "./progress";
const {Search} = Input;

@connect(
    state => ({
        loginAccount: state.accounts.loginAccount
    })
)
class TaskList extends React.Component<{loginAccount?}> {

    state = {
        loading: true,
        tasks: null,
        onlyFinishedTasks: false,
        startDoneTime: undefined,
        endDoneTime: undefined,
        searchKey: undefined
    };

    componentDidMount(): void {
        this.fetchTasks();
    }

    getQueryParams() {
        let {loginAccount: {name}} = this.props;
        let {onlyFinishedTasks, startDoneTime, endDoneTime, searchKey} = this.state;

        return collectRequestParams({
            done: onlyFinishedTasks,
            startDoneTime,
            endDoneTime,
            key: searchKey,
            owner: name,
        }).join('&')
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

    get columns() {

        let {tasks = []} = this.state;

        return [
            {
                title: "序号",
                dataIndex: 'id',
                key: 'id',
                width: '4em',
                render: (id, record) => (
                    <span>
                        <TaskDetailDrawerLink
                            taskId={id}
                            onClosed={() => this.fetchTasks()}>
                            {tasks.indexOf(record) + 1}
                        </TaskDetailDrawerLink>
                    </span>
                )
            },
            {
                title: '供应商全称',
                dataIndex: 'supplierName',
                key: 'supplierName',
                width: '10em',
            }, {
                title: '供应商类型',
                dataIndex: 'supplierType',
                key: 'supplierType',
                width: '8em',
            }, {
                title: '品类',
                dataIndex: 'subtype',
                key: 'subtype',
                width: '8em',
            }, {
                title: '任务类型',
                dataIndex: 'type',
                key: 'type',
                width: '8em',
            }, {
                title: '备注',
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
            }
        ];
    }

    executeQuery(criteria) {
        this.setState({
            ...criteria,
            loading: true
        }, () => this.fetchTasks());
    }

    toggleOnlyFinishedTasks = checked => {
        this.setState({
            loading: true,
            onlyFinishedTasks: checked
        }, () => this.fetchTasks());
    };

    setSearchKey = value => {
        this.executeQuery({
            searchKey: value
        })
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
                    <Search placeholder="按关键字查询" onSearch={this.setSearchKey} style={{ width: "12em", marginLeft: "1em" }} />
                </div>
                <Table
                    loading={!this.state.tasks || this.state.loading}
                    size="middle"
                    rowKey="id"
                    dataSource={this.state.tasks}
                    columns={this.columns}
                    pagination={{pageSize: 20}}
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

