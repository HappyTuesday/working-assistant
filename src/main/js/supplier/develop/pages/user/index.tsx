import React from 'react'
import { Link } from "react-router-dom";
import {Table, Button, Popconfirm, Divider, Select, Icon} from "antd";
import {request} from "../../../../request";
const {Option} = Select;

class UserList extends React.Component {

    state = {
        loading: true,
        users: []
    };

    componentDidMount(): void {
        this.fetchUsers();
    }

    fetchUsers() {
        request({
            url: "/api/supplier/develop/users"
        }, users => {
            this.setState({
                loading: false,
                users
            })
        })
    }

    deleteUser(id) {
        request({
            url: "/api/supplier/develop/users/" + id,
            method: "DELETE"
        }, () => {
            this.fetchUsers()
        });
    }

    columns = [
        {
            title: '用户名',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '登录密码',
            dataIndex: 'password',
            key: 'password'
        }, {
            title: '是否为管理员',
            dataIndex: 'manager',
            key: 'manager',
            render: manager => manager ? '管理员' : '普通用户'
        }, {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => (
                <div>
                    <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteUser(record.id)}>
                        <a href="javascript:" title="删除此用户">
                            <Icon type="delete"/>
                        </a>
                    </Popconfirm>
                    <Divider type="vertical"/>
                    <Link to={"/supplier/develop/users/edit/" + record.id}>
                        <Icon type="edit" title="编辑此用户"/>
                    </Link>
                </div>
            )
        }
    ];

    render() {
        return (
            <div>
                <h2>用户管理</h2>
                <Link to="/supplier/develop/users/create">
                    <Button type="primary" style={{ marginBottom: 16 }} icon="user-add">
                        创建新账号
                    </Button>
                </Link>
                <Table
                    loading={this.state.loading}
                    size="middle"
                    rowKey="id"
                    dataSource={this.state.users}
                    columns={this.columns}
                    pagination={{pageSize: 20}}
                />
            </div>
        )
    }
}

export class UserSelect extends React.Component<any, {value, users}> {
    static getDerivedStateFromProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            return {
                ...(nextProps.value || {}),
            };
        }
        return null;
    }

    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
            users: null
        };
    }

    componentDidMount(): void {
        this.fetchUsers();
    }

    fetchUsers() {
        request({
            url: "/api/supplier/develop/users"
        }, users => {
            this.setState({
                users
            })
        })
    }

    handleChange = value => {
        if (!('value' in this.props)) {
            this.setState({ value });
        }
        this.triggerChange(value);
    };

    triggerChange = changedValue => {
        // Should provide an event to pass value to Form.
        const { onChange } = this.props;
        if (onChange) {
            onChange({value: changedValue});
        }
    };

    render() {
        let {value, users} = this.state;
        return (
            <Select
                loading={!users}
                value={value}
                onChange={this.handleChange}>
                {users && users.map(u => <Option value={u.name} key={u.id}>{u.name}</Option>)}
            </Select>
        );
    }
}

export class UserListPage extends React.Component {
    render() {
        return (
            <div>
                <UserList/>
            </div>
        )
    }
}