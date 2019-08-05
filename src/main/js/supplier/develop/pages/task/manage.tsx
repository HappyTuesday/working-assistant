import React from 'react'
import {Link} from "react-router-dom";
import {Button, Divider, Icon, Input, Popconfirm, Table} from "antd";
import {collectRequestParams, request} from "../../../../request";
import {TaskDetailDrawerLink} from "./detail";
import {ProgressLabel} from "./progress";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {unique} from "../../../../lambda";
import {
    renderTaskStatusRadio,
    renderTransitTimeRanger,
    showTransitTimeTitle,
    TaskStatus
} from "../../models/task";
import dateFormat from "dateformat"
import {RangePickerValue} from "antd/lib/date-picker/interface";
import moment from "moment";

const {Search} = Input;

@connect(
    state => ({
        loginAccount: state.accounts.loginAccount
    })
)
class TaskManageList extends React.Component<{loginAccount?}> {

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
        let {taskStatus, startTransitTime, endTransitTime, searchKey} = this.state;

        return collectRequestParams({
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

    deleteTask(id) {
        this.setState({loading: true});

        request({
            url: "/api/supplier/develop/tasks/" + id,
            method: "DELETE"
        }, () => {
            this.fetchTasks()
        });
    }

    transitTask(id, method: "finish" | "cancel") {
        this.setState({loading: true});

        request({
            url: "/api/supplier/develop/tasks/" + method + "/" + id,
            method: "POST"
        }, () => {
            this.fetchTasks()
        });
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
            }, {
                title: '负责人',
                dataIndex: 'owner.name',
                key: 'owner.name',
                width: '6em',
                ...this.getFilter(tasks, t => t.owner.name)
            }, {
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
                ...this.getFilter(tasks, t => t.supplierType)
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
                title: '当前进度',
                dataIndex: 'statusOfToday',
                key: 'statusOfToday',
                render: p => p && <ProgressLabel progress={p}/>
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
                    <div>
                        {/*<Link to={"/supplier/develop/tasks/detail/" + record.id}>*/}
                            {/*<Icon type="menu-unfold" title="查看详情"/>*/}
                        {/*</Link>*/}
                        {taskStatus === TaskStatus.ACTIVE && (
                            <React.Fragment>
                                <Popconfirm title="确认要完成此任务吗?" onConfirm={() => this.transitTask(record.id, "finish")}>
                                    <a href="javascript:" title="完成此任务">
                                        <Icon type="check"/>
                                    </a>
                                </Popconfirm>
                                <Divider type="vertical"/>
                                <Popconfirm title="确认要终止此任务吗?" onConfirm={() => this.transitTask(record.id, "cancel")}>
                                    <a href="javascript:" title="终止此任务">
                                        <Icon type="close"/>
                                    </a>
                                </Popconfirm>
                                <Divider type="vertical"/>
                            </React.Fragment>
                        )}
                        <Link to={"/supplier/develop/tasks/edit/" + record.id}>
                            <Icon type="edit" title="编辑此任务"/>
                        </Link>
                        {/*<Divider type="vertical"/>*/}
                        {/*<Popconfirm title="确认要删除此任务吗?" onConfirm={() => this.deleteTask(record.id)}>*/}
                            {/*<a href="javascript:" title="删除此任务">*/}
                                {/*<Icon type="delete"/>*/}
                            {/*</a>*/}
                        {/*</Popconfirm>*/}
                    </div>
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
            startTransitTime: start ? start.toDate().getTime() : undefined,
            endTransitTime: end ? end.add(1, 'day').toDate().getTime() : undefined,
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
                <h2>任务管理</h2>
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
                    pagination={{pageSize: 20}}
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