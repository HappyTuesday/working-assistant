import React from "react"
import moment from 'moment';

export class ProgressLabel extends React.Component<{progress, onlyToday?}> {
    render() {
        let {progress: p, onlyToday} = this.props;

        let today = moment().startOf('day');
        if (onlyToday && today.isSameOrAfter(p.timestamp)) {
            return <MissingProgress/>
        }

        return (
            <span title={`@${p.author.name} ${p.comment}`}>{p.content}</span>
        )
    }
}

export class MissingProgress extends React.Component {
    render() {
        return <span style={{color: "#ff4d4d"}}>尚未更新</span>
    }
}