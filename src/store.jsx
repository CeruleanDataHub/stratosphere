import {configureStore} from '@reduxjs/toolkit';
import denimMiddleware, {
  devicesReducer,
  hierarchyReducer,
  activityReducer,
  Auth0SessionProvider,
} from '@ceruleandatahub/middleware-redux';
import env from './config';

const envVar = env();

const settingsProvider = {
  API_URL: envVar.BASE_API_URL,
  API_PREFIX: '/api/v1',
  AUTH0_PREFIX: '/auth0',
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
  },
  middleware: [
    ...denimMiddleware(settingsProvider, cacheProvider, sessionProvider),
  ],
});

export {store, setToken, setIdToken};
