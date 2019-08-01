import React from "react"
import moment from 'moment';

export class ProgressLabel extends React.Component<{progress, onlyToday?}> {
    render() {
        let {progress: p, onlyToday} = this.props;

        let today = moment().startOf('day');
        if (onlyToday && today.isSameOrAfter(p.timestamp)) {
            return <span style={{color: "#ff4d4d"}}>尚未填写</span>
        }

        return (
            <span title={`@${p.author.name} ${p.comment}`}>{p.content}</span>
        )
    }
}