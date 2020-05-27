import {configureStore} from '@reduxjs/toolkit';
import denimMiddleware, {
  devicesReducer,
  Auth0SessionProvider,
} from '@denim/iot-platform-middleware-redux';
import env from './config';

const envVar = env();

const settingsProvider = {
  API_URL: envVar.BASE_API_URL,
};

const cacheProvider = {};

const sessionProvider = new Auth0SessionProvider();

const setToken = token => {
  sessionProvider.setToken(token);
};

const store = configureStore({
  reducer: {
    devices: devicesReducer,
  },
  middleware: [
    ...denimMiddleware(settingsProvider, cacheProvider, sessionProvider),
  ],
});

export {store, setToken};
