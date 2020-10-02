import denimMiddleware, {
  Auth0SessionProvider,
  activityReducer,
  devicesReducer,
  hierarchyReducer,
  permissionsReducer,
  rolesReducer,
  usersReducer,
} from '@ceruleandatahub/middleware-redux';
import {configureStore} from '@reduxjs/toolkit';

import env from './config';

const envVar = env();

const settingsProvider = {
  API_URL: envVar.BASE_API_URL,
  API_ROOT: envVar.API_ROOT,
  API_VERSION: envVar.API_VERSION,
};

const cacheProvider = {};

const sessionProvider = new Auth0SessionProvider();
sessionProvider.setTenant(envVar.AUTH0_TENANT);

const setToken = token => {
  sessionProvider.setToken(token);
};

const setIdToken = idToken => {
  sessionProvider.setIdToken(idToken);
};

const store = configureStore({
  reducer: {
    devices: devicesReducer,
    hierarchies: hierarchyReducer,
    userActivity: activityReducer,
    roles: rolesReducer,
    permissions: permissionsReducer,
    users: usersReducer,
  },
  middleware: [
    ...denimMiddleware(settingsProvider, cacheProvider, sessionProvider),
  ],
});

export {store, setToken, setIdToken};
