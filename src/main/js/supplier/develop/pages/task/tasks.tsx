import React from 'react'
import { Link } from "react-router-dom";
import {Table, Button, Input, Icon, List, Descriptions, Divider, Popconfirm} from "antd";
import {collectRequestParams, request} from "../../../../request";
import { connect } from "react-redux";
import {TaskDetailDrawerLink} from "./detail";
import {ProgressLabel} from "./progress";
import {
    renderTaskStatusRadio,
    renderTransitTimeRanger,
    showTransitTimeTitle, TaskBriefList, TaskStatus
} from "../../models/task";
const {Search} = Input;
import dateFormat from "dateformat"
import {RangePickerValue} from "antd/lib/date-picker/interface";
import {onlyDate, unique} from "../../../../lambda";
import moment from 'moment';
import Media from "react-media";

@connect(
    state => ({
        loginAccount: state.accounts.loginAccount
    })
)
class TaskTable extends React.Component<{loginAccount?}> {

    state = {
        tasks: undefined,
        loading: true,
        taskStatus: TaskStatus.ACTIVE,
        startTransitTime: undefined,
        endTransitTime: undefined,
        searchKey: undefined
    };

    componentDidMount(): void {
        this.fetchTasks();
    }

    getQueryParams() {
        let {loginAccount: {name}} = this.props;
        let {taskStatus, startTransitTime, endTransitTime, searchKey} = this.state;

        return collectRequestParams({
            owner: name,
            taskStatus,
            startTransitTime,
            endTransitTime,
            searchKey
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

    getFilter(tasks, field) {
        let keys = unique(tasks.map(t => field(t)));
        return {
            filters: keys.map(t => ({text: t, value: t})),
            onFilter: (value, record) => value === field(record)
        }
    }

    get columns() {
        let {taskStatus, tasks = []} = this.state;

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
                width: '12em',
                ...this.getFilter(tasks, t => t.supplierName)
            }, {
                title: '类别',
                dataIndex: 'supplierType',
                key: 'supplierType',
                width: '6em',
                ...this.getFilter(tasks, t => t.supplierType),
            }, {
                title: '品类',
                dataIndex: 'subtype',
                key: 'subtype',
                width: '7em',
                ...this.getFilter(tasks, t => t.subtype)
            }, {
                title: '任务类型',
                dataIndex: 'type',
                key: 'type',
                width: '9em',
                ...this.getFilter(tasks, t => t.type)
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
                title: '今日进度',
                dataIndex: 'statusOfToday',
                key: 'statusOfToday',
                render: p => <ProgressLabel progress={p}/>
            }, {
                title: showTransitTimeTitle(taskStatus),
                dataIndex: 'transitTime',
                key: 'transitTime',
                width: '6em',
                sorter: (x, y) => moment(x.transitTime).date() - moment(y.transitTime).date(),
                render: transitTime => dateFormat(transitTime, "yyyy/mm/dd")
            }, {
                title: '操作',
                dataIndex: 'operation',
                width: '7em',
                render: (text, record) => (
                    <Link to={"/supplier/develop/tasks/edit/" + record.id}>
                        <Icon type="edit" title="编辑此任务"/>
                    </Link>
                )
            }
        ];
    }

    executeQuery(criteria) {
        this.setState({
            ...criteria,
            loading: true
        }, () => this.fetchTasks());
    }

    setTaskStatus = e => {
        this.executeQuery({
            taskStatus: e.target.value
        });
    };

    setTransitTimeRangeOfDay = ([start, end]: RangePickerValue) => {
        this.executeQuery({
            startTransitTime: start ? onlyDate(start).toDate().getTime() : undefined,
            endTransitTime: end ? onlyDate(end).add(1, 'day').toDate().getTime() : undefined,
        });
    };

    setSearchKey = value => {
        this.executeQuery({
            searchKey: value
        })
    };

    render() {
        let {taskStatus} = this.state;

        return (
            <div>
                <h2>我的任务列表</h2>
                <div>
                    <Link to="/supplier/develop/tasks/create">
                        <Button type="primary" style={{ marginBottom: 16 }} icon="plus">
                            添加新任务
                        </Button>
                    </Link>

                    {renderTaskStatusRadio({
                        defaultValue: taskStatus,
                        onChange: this.setTaskStatus,
                        style: {marginLeft: "1em"}
                    })}

                    <Search placeholder="按关键字查询"
                            onSearch={this.setSearchKey}
                            style={{ width: "12em", marginLeft: "1em" }} />

                    {renderTransitTimeRanger({
                        onChange: this.setTransitTimeRangeOfDay,
                        style: {marginLeft: "1em"}
                    })}

                    <a href={"/api/supplier/develop/tasks/excel?" + this.getQueryParams()}
                       style={{marginLeft: "1em"}}
                       title="导出"
                       target="_blank"
                       download="开发进度.xlsx">
                        <Icon type="export" /> 导出到Excel
                    </a>
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

@connect(
    state => ({
        loginAccount: state.accounts.loginAccount
    })
)
class TaskList extends React.Component<{loginAccount?}> {

    state = {
        tasks: undefined,
        loading: true,
        taskStatus: TaskStatus.ACTIVE
    };

    componentDidMount(): void {
        this.fetchTasks();
    }

    getQueryParams() {
        let {loginAccount: {name}} = this.props;
        let {taskStatus} = this.state;

        return collectRequestParams({
            owner: name,
            taskStatus
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

    executeQuery(criteria) {
        this.setState({
            ...criteria,
            loading: true
        }, () => this.fetchTasks());
    }

    setTaskStatus = e => {
        this.executeQuery({
            taskStatus: e.target.value
        });
    };

    render() {
        let {tasks, taskStatus} = this.state;

        return (
            <div>
                <h2>我的任务列表</h2>
                <div>
                    <Link to="/supplier/develop/tasks/create">
                        <Button type="primary" style={{ marginBottom: 16 }} icon="plus">
                            添加新任务
                        </Button>
                    </Link>

                    {renderTaskStatusRadio({
                        defaultValue: taskStatus,
                        onChange: this.setTaskStatus,
                        style: {marginLeft: "1em"}
                    })}
                </div>
                <TaskBriefList loading={this.state.loading} tasks={tasks}/>
            </div>
        )
    }
}

export class TaskListPage extends React.Component {
    render() {
        return (
            <Media query="(max-width: 599px)">
                {isMobile => isMobile ? <TaskList/> : <TaskTable/>}
            </Media>
        )
    }
}