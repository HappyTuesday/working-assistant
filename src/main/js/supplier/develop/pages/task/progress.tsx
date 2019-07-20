import React from "react"

export class ProgressLabel extends React.Component<{progress}> {
    render() {
        let {progress: p} = this.props;

        return (
            <span title={`@${p.author} ${p.comment}`}>{p.content}</span>
        )
    }
}