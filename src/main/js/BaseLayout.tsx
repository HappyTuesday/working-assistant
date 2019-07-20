import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import SupplierDevelop from "./supplier/develop";
import {NotFound} from "./404";

class Home extends React.Component {
    render() {
        return (
            <div>
                <h1>Welcome to Working Assistant</h1>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/supplier/develop/">Supplier Develop</Link>
                    </li>
                </ul>
            </div>
        )
    }
}

export default class BaseLayout extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/supplier/develop/" component={SupplierDevelop} />
                    <Route component={NotFound}/>
                </Switch>
            </Router>
        )
    }
}