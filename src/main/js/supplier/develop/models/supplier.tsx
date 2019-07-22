import React from "react"
import {Select} from "antd";

const SUPPLIER_TYPES = [
    "直运",
    "备货",
    "服务",
    "一次性"
];

export const SUPPLIER_TYPE_SELECT = (
    <Select>
        {SUPPLIER_TYPES.map(v => <Select.Option value={v}>{v}</Select.Option>)}
    </Select>
);