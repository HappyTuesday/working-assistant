import React from "react"

export class ProgressLabel extends React.Component<{progress}> {
    render() {
        let {progress: p} = this.props;

        if (!p) {
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