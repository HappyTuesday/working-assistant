import React from 'react'
import { Link } from "react-router-dom";
import {Table, Button, Popconfirm, Divider, Switch, Icon, DatePicker, Input} from "antd";
import {collectRequestParams, request} from "../../../../request";
import {TaskDetailDrawerLink} from "./detail";
import {ProgressLabel} from "./progress";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import dateFormat from "dateformat"
import {unique} from "../../../../lambda";
import moment from 'moment';
import {Moment} from 'moment';
const {Search} = Input;
const { MonthPicker } = DatePicker;

@connect(
    state => ({
        loginAccount: state.accounts.loginAccount
    })
)
class TaskManageList extends React.Component<{loginAccount?}> {

    state = {
        tasks: undefined,
        loading: true,
        onlyFinishedTasks: false,
        startDoneTime: undefined,
        endDoneTime: undefined,
        searchKey: undefined
    };

    componentDidMount(): void {
        this.fetchTasks();
    }

    getQueryParams() {
        let {onlyFinishedTasks, startDoneTime, endDoneTime, searchKey} = this.state;

        return collectRequestParams({
            done: onlyFinishedTasks,
            startDoneTime,
            endDoneTime,
            key: searchKey
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
        let keys = unique(tasks.map(t => field(t)));
        return {
            filters: keys.map(t => ({text: t, value: t})),
            onFilter: (value, record) => value === field(record)
        }
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
            }, {
                title: '负责人',
                dataIndex: 'owner.name',
                key: 'owner.name',
                ...this.getFilter(tasks, t => t.owner.name)
            }, {
                title: '供应商全称',
                dataIndex: 'supplierName',
                key: 'supplierName',
                ...this.getFilter(tasks, t => t.supplierName)
            }, {
                title: '供应商类型',
                dataIndex: 'supplierType',
                key: 'supplierType',
                ...this.getFilter(tasks, t => t.supplierType)
            }, {
                title: '品类',
                dataIndex: 'subtype',
                key: 'subtype',
                ...this.getFilter(tasks, t => t.subtype)
            }, {
                title: '任务类型',
                dataIndex: 'type',
                key: 'type',
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

    executeQuery(criteria) {
        this.setState({
            ...criteria,
            loading: true
        }, () => this.fetchTasks());
    }

    toggleOnlyFinishedTasks = checked => {
        this.executeQuery({onlyFinishedTasks: checked});
    };

    setDoneTimeMonth = (time: Moment) => {
        this.executeQuery(this.monthToDoneTime(time));
    };

    monthToDoneTime(time: Moment) {
        let month = moment([time.year(), time.month()]);
        return {
            startDoneTime: month.toDate().getTime(),
            endDoneTime: month.add(1, "month").toDate().getTime()
        }
    }

    setSearchKey = value => {
        this.executeQuery({
            searchKey: value
        })
    };

    render() {
        let {onlyFinishedTasks} = this.state;

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
                            defaultChecked={onlyFinishedTasks}
                            onChange={this.toggleOnlyFinishedTasks}
                        />
                        仅已完成任务
                    </label>
                    {onlyFinishedTasks && (
                        <MonthPicker style={{marginLeft: "1em"}} placeholder="选择月份" onChange={this.setDoneTimeMonth}/>
                    )}
                    <Search placeholder="按关键字查询" onSearch={this.setSearchKey} style={{ width: "12em", marginLeft: "1em" }} />
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