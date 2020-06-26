import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createBrowserHistory} from 'history';

import {Auth0Provider} from './auth0-spa.jsx';
import Application from './application.jsx';
import Header from './containers/Header/Header.jsx';
import Navigation from './containers/Navigation/Navigation.jsx';
import Dashboard from './containers/Dashboard/Dashboard.jsx';
import Device from './containers/Device/Device.jsx';
import UserManagement from './containers/UserManagement/UserManagement.jsx';
import User from './containers/UserManagement/User.jsx';
import ResourceManagement from './containers/ResourceManagement/ResourceManagement.jsx';
import Role from './containers/ResourceManagement/Role.jsx';
import HierarchyManagement from './containers/HierarchyManagement/HierarchyManagement.jsx';

import env from './config';
import {store} from './store.jsx';

import './index.css';
import 'react-sortable-tree/style.css';

const envVar = env();

const onRedirectCallback = appState => {
  createBrowserHistory().push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname,
  );
};

ReactDOM.render(
  <Provider store={store}>
    <Auth0Provider
      domain={envVar.AUTH0_DOMAIN}
      client_id={envVar.AUTH0_CLIENT_ID}
      audience={envVar.AUTH0_AUDIENCE}
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
            <Route exact path="/user-management" component={UserManagement} />
            <Route path={`/user-management/user/:userId`} component={User} />
            <Route
              exact
              path={`/resource-management`}
              component={ResourceManagement}
            />
            <Route
              path={`/resource-management/role/:roleId`}
              component={Role}
            />
            <Route
              exact
              path={'/hierarchy-management'}
              component={HierarchyManagement}
            />
            <Route path="/" />
          </Switch>
        </Application>
      </Router>
    </Auth0Provider>
  </Provider>,

  document.getElementById('root'),
);

if (window.Cypress) {
  window.store = store;
}
