import React from "react"
import {Select} from "antd";

const TASK_TYPES = [
    "新引进供应商",
    "新增标的物",
    "一次性采购",
    "降税",
    "补合同16%税率",
    "补合同13%税率",
    "补合同10%税率",
    "补合同9%税率",
    "补合同3%税率"
];

export const TASK_TYPE_SELECT = (
    <Select>
        {TASK_TYPES.map(v => <Select.Option value={v}>{v}</Select.Option>)}
    </Select>
);

const TASK_SUBTYPES = [
    "一次性采购",
    "保洁",
    "备货",
    "橱柜",
    "窗帘",
    "床垫",
    "服务",
    "工装",
    "后勤",
    "家电",
    "家具",
    "木工",
    "木门",
    "泥工",
    "施工队",
    "锁匠",
    "铁艺床",
    "维修",
    "物流"
];

export const TASK_SUBTYPE_SELECT = (
    <Select>
        {TASK_SUBTYPES.map(v => <Select.Option value={v}>{v}</Select.Option>)}
    </Select>
);