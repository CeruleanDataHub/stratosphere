import React, {useState} from "react";
import "normalize.css";
import "./denim.css";

import { useAuth0 } from "./auth0-spa";
import Application from "./containers/Application.jsx";
import Header from "./containers/Header/Header.jsx";
import Navigation from "./containers/Navigation/Navigation.jsx";
import Dashboard from "./containers/Dashboard/Dashboard.jsx";
import NotificationPanel from './containers/NotificationPanel/NotificationPanel.jsx';

const DenimAdmin = () => {
    const {
        user,
        isAuthenticated,
        loginWithRedirect,
        logout,
        getTokenSilently,
        loading
    } = useAuth0();
    const [notificationStatus, setNotificationStatus] = useState(null);

    if (loading) {
        return (
            <div> Loading... </div>
        );
    }
    /*if (!isAuthenticated) {
        loginWithRedirect({ returnTo: window.location.href });
        return <div>Redirecting to login...</div>;
    }*/
    const addNotificationStatus = (text) => setNotificationStatus(text)
    console.log('notification text ', notificationStatus);
    return (
        <Application className="container">
            <Header />
            <Navigation />
            <Dashboard setNotificationStatus={addNotificationStatus}/>
            <NotificationPanel text={notificationStatus}/>

        </Application>
    );
}

export default DenimAdmin;