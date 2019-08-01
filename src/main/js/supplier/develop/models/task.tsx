import React from "react"
import {DatePicker, Select, Radio} from "antd";
import {RangePickerProps} from "antd/es/date-picker/interface";
const { RangePicker } = DatePicker;
import moment from 'moment';
import {RadioGroupProps} from "antd/lib/radio";

const TASK_TYPES = [
    "新引进供应商",
    "新增标的物",
    "一次性采购",
    "不合作供应商重新引进",
    "降税",
    "补合同16%税率",
    "补合同13%税率",
    "补合同10%税率",
    "补合同9%税率",
    "补合同3%税率",
];

export const TASK_TYPE_SELECT = (
    <Select>
        {TASK_TYPES.map(v => <Select.Option value={v} key={v}>{v}</Select.Option>)}
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
        {TASK_SUBTYPES.map(v => <Select.Option value={v} key={v}>{v}</Select.Option>)}
    </Select>
);

export const TaskStatus = {
    ACTIVE: "ACTIVE",
    FINISHED: "FINISHED",
    CANCELED: "CANCELED"
};

export function showTaskStatus(taskStatus) {
    switch (taskStatus) {
        case TaskStatus.ACTIVE:
            return "跟进中";
        case TaskStatus.FINISHED:
            return "已完成";
        case TaskStatus.CANCELED:
            return "已终止";
        default:
            return taskStatus;
    }
}

export function showTransitTimeTitle(taskStatus) {
    switch (taskStatus) {
        case TaskStatus.ACTIVE:
            return "开始时间";
        case TaskStatus.FINISHED:
            return "完成时间";
        case TaskStatus.CANCELED:
            return "终止时间";
        default:
            return taskStatus;
    }
}

export function renderTransitTimeRanger(props: RangePickerProps) {
    let today = () => moment().startOf('day');
    return (
        <RangePicker format="YYYY/MM/DD"
                     placeholder={["开始时间", "结束时间"]}
                     ranges={{
                         "今天": [
                             today(),
                             today()
                         ],
                         "昨天": [
                             today().subtract(1, 'day'),
                             today().subtract(1, 'day')
                         ],
                         '本月': [
                             today().startOf('month'),
                             today().endOf('month')
                         ],
                         '上月': [
                             today().subtract(1, 'month').startOf('month'),
                             today().subtract(1, 'month').endOf('month')
                         ],
                     }}
                     {...props}
        />
    )
}

export function renderTaskStatusRadio(props: RadioGroupProps = {}) {
    return (
        <Radio.Group {...props}>
            <Radio.Button value={TaskStatus.ACTIVE}>跟进中</Radio.Button>
            <Radio.Button value={TaskStatus.FINISHED}>已完成</Radio.Button>
            <Radio.Button value={TaskStatus.CANCELED}>已终止</Radio.Button>
        </Radio.Group>
    )
}