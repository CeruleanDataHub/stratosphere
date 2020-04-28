import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {createBrowserHistory} from 'history';

import {Auth0Provider} from './auth0-spa.jsx';
import Application from './application.jsx';
import Header from './containers/Header/Header.jsx';
import Navigation from './containers/Navigation/Navigation.jsx';
import Dashboard from './containers/Dashboard/Dashboard.jsx';
import Device from './containers/Device/Device.jsx';
import UserManagement from './containers/UserManagement/UserManagement.jsx';

import config from './auth_config.json';
import './index.css';

const onRedirectCallback = appState => {
  createBrowserHistory().push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname,
  );
};
ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
    <Router>
      <Application className="container">
        <div>
          <Header />
          <Navigation />
        </div>
        <Switch>
          <Route exact path="/devices" component={Dashboard} />
          <Route path={`/devices/:deviceId`} component={Device} />
          <Route path="/user-management" component={UserManagement} />
          <Route path="/user-management/:userId" component={UserManagement} />
          <Route path="/" />
        </Switch>
      </Application>
    </Router>
  </Auth0Provider>,
  document.getElementById('root'),
);
