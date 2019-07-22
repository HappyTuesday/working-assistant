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