import React from 'react'
import ReactDOM from 'react-dom'
import BaseLayout from "./BaseLayout";
import 'antd/dist/antd.less';

class App extends React.Component {
    render() {
        return <BaseLayout/>
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);