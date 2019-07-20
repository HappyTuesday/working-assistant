import React from "react"
import {Icon} from "antd";

export class NotFound extends React.Component {
    render() {
        return (
            <div>
                <h2>
                    <Icon type="frown" />
                    Not Found
                </h2>
            </div>
        )
    }
}