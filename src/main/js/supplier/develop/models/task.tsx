import React from "react"
import {DatePicker, Select, Radio, List} from "antd";
import {DatePickerProps, RangePickerProps} from "antd/es/date-picker/interface";
const { RangePicker } = DatePicker;
import moment from 'moment';
import {RadioGroupProps} from "antd/lib/radio";
import {ProgressLabel} from "../pages/task/progress";
import {Link} from "react-router-dom";

const TASK_TYPES = [
    "新引进供应商",
    "新增标的物",
    "新增区域",
    "一次性采购",
    "补合同16%税率",
    "补合同13%税率",
    "补合同10%税率",
    "补合同9%税率",
    "补合同6%税率",
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

export function renderTargetDatePicker(props: DatePickerProps) {
    return (
        <DatePicker format="YYYY/MM/DD"
                    showTime={false}
                    placeholder="选择进度截止日期"
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

const PROGRESS_TYPES = [
    "1.询价中",
    "2.供应商注册流程中",
    "3.比价/资质流程中",
    "4.上会/出决议流程中",
    "5.标的物匹配流程中",
    "6.合同起草流程中",
    "7.合同审批流程中",
    "8.供应商盖章流程中",
    "9.合同邮寄流程中",
    "10.价格审批单流程中",
    "11.合同用印流程中",
    "12.已完成"
];

const PROGRESS_TYPE_ONE_TIME = [
    "1.询价中",
    "2.比价流程中",
    "3.发起请示单，请示采购",
    "4.付款申请中",
    "5.已采购物流配送中",
    "6.已到货，完成"
];

export function getProgressTypeSelect(taskType: string) {
    let types;
    if (taskType === '一次性采购') {
        types = PROGRESS_TYPE_ONE_TIME;
    } else {
        types = PROGRESS_TYPES;
    }

    return (
        <Select>
            {types.map(v => <Select.Option value={v} key={v}>{v}</Select.Option>)}
        </Select>
    )
}

export class TaskBriefList extends React.Component<{loading: boolean, tasks: any[]}> {
    render() {
        let {loading, tasks} = this.props;
        return (
            <List loading={loading || !tasks}
                  dataSource={tasks}
                  renderItem={ (task: any) =>
                      <List.Item key={task.id}>
                          <div>
                              <div>
                                  <Link to={"/supplier/develop/tasks/detail/" + task.id}>
                                      <span style={{fontWeight: "bold", fontSize: "1.2em"}}>
                                          {"#" + (tasks.indexOf(task) + 1)}
                                      </span>
                                      <span style={{marginLeft: "1em"}}>{task.supplierName}</span>
                                  </Link>
                              </div>
                              <div>
                                  <label style={{fontWeight: "bold"}}>昨日进度：</label>
                                  {task.statusOfYesterday && <ProgressLabel progress={task.statusOfYesterday}/>}
                              </div>
                              <div>
                                  <label style={{fontWeight: "bold"}}>今日进度：</label>
                                  <ProgressLabel progress={task.statusOfToday}/>
                              </div>
                          </div>
                      </List.Item>
                  }
            />
        )
    }
}