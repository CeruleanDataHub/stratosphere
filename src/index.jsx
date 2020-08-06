import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createBrowserHistory} from 'history';
import {ThemeProvider} from 'styled-components';
import {ModalProvider} from 'styled-react-modal';

import {Auth0Provider} from './auth0-spa.jsx';
import Application from './application.jsx';
import Header from './containers/Header/Header.jsx';
import Navigation from './containers/Navigation/Navigation.jsx';
import DeviceContainer from './containers/Device/DeviceContainer.jsx';
import Device from './containers/Device/Device.jsx';
import UserManagement from './containers/UserManagement/UserManagement.jsx';
import User from './containers/UserManagement/User.jsx';
import UsersAndRoles from './containers/UserAndRoleManagement/UsersAndRoles.jsx';
import ManageUsers from './containers/UserAndRoleManagement/ManageUsers/ManageUsers.jsx';
import ManageRoles from './containers/UserAndRoleManagement/ManageRoles/ManageRoles.jsx';

import ResourceRoleManagement from './containers/ResourceRoleManagement/ResourceRoleManagement.jsx';
import Role from './containers/ResourceRoleManagement/Role.jsx';
import HierarchyManagement from './containers/HierarchyManagement/HierarchyManagement.jsx';
import ReportingDashboard from './containers/ReportingDashboard/ReportingDashboard.jsx';

import env from './config';
import {store} from './store.jsx';

import './index.css';
import 'react-sortable-tree/style.css';

const envVar = env();

const theme = {
  background: 'white',
};
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
      <ThemeProvider theme={theme}>
        <ModalProvider>
          <Router>
            <Application className="container">
              <Header />
              <Navigation />

              <Switch>
                <Route exact path="/devices" component={DeviceContainer} />
                <Route path={`/devices/:deviceId`} component={Device} />
                <Route
                  exact
                  path="/user-management"
                  component={UserManagement}
                />
                <Route
                  path={`/user-management/user/:userId`}
                  component={User}
                />
                <Route
                  exact
                  path={`/resource-management`}
                  component={ResourceRoleManagement}
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
                <Route
                  exact
                  path={'/reporting-dashboard'}
                  component={ReportingDashboard}
                />
                <Route
                  exact
                  path={'/users-and-roles'}
                  component={UsersAndRoles}
                />
                <Route path={'/manage-users'} component={ManageUsers} />

                <Route path={'/manage-roles'} component={ManageRoles} />
                <Route path="/" />
              </Switch>
            </Application>
          </Router>
        </ModalProvider>
      </ThemeProvider>
    </Auth0Provider>
  </Provider>,
  document.getElementById('root'),
);

if (window.Cypress) {
  window.store = store;
}
