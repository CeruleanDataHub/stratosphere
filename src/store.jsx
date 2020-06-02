import {configureStore} from '@reduxjs/toolkit';
import denimMiddleware, {
  devicesReducer,
  hierarchyReducer,
  Auth0SessionProvider,
} from '@denim/iot-platform-middleware-redux';
import env from './config';

const envVar = env();

const settingsProvider = {
  API_URL: envVar.BASE_API_URL,
};

const cacheProvider = {};

const sessionProvider = new Auth0SessionProvider();
sessionProvider.setTenant(envVar.AUTH0_TENANT);

const setToken = token => {
  sessionProvider.setToken(token);
};

const store = configureStore({
  reducer: {
    devices: devicesReducer,
    hierarchies: hierarchyReducer,
  },
  middleware: [
    ...denimMiddleware(settingsProvider, cacheProvider, sessionProvider),
  ],
});

export {store, setToken};
