import React from "react";
import "normalize.css";
import "./denim.css";

import Application from "./containers/Application.jsx";
import Header from "./containers/Header/Header.jsx";
import Navigation from "./containers/Navigation/Navigation.jsx";
import Dashboard from "./containers/Dashboard/Dashboard.jsx";

export default class DenimAdmin extends React.Component {

    render() {
        return (
            <Application className="container">
                <Header />
                <Navigation />
                <Dashboard />
            </Application>
        );
    }
}
