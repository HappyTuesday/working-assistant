import React from 'react'
import { Link } from "react-router-dom";
import {Table, Button, Popconfirm, Divider} from "antd";
import {request} from "../../../../request";

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
            title: 'User Name',
            dataIndex: 'username',
            key: 'username',
        }, {
            title: 'Password',
            dataIndex: 'password',
            key: 'password'
        }, {
            title: 'Is Manager',
            dataIndex: 'manager',
            key: 'manager'
        }, {
            title: 'operation',
            dataIndex: 'operation',
            render: (text, record) => (
                <div>
                    <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteUser(record.id)}>
                        <a href="javascript:">Delete</a>
                    </Popconfirm>
                    <Divider type="vertical"/>
                    <Link to={"/supplier/develop/users/edit/" + record.id}>Edit</Link>
                </div>
            )
        }
    ];

    render() {
        return (
            <div>
                <h2>Users</h2>
                <Link to="/supplier/develop/users/create">
                    <Button type="primary" style={{ marginBottom: 16 }}>
                        Create
                    </Button>
                </Link>
                <Table
                    loading={this.state.loading}
                    size="middle"
                    rowKey="id"
                    dataSource={this.state.users}
                    columns={this.columns}
                    pagination={{size: "100"}}
                />
            </div>
        )
    }
}

export class UserListPage extends React.Component {
    render() {
        return (
            <UserList/>
        )
    }
}