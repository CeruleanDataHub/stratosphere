import {configureStore} from '@reduxjs/toolkit';
import denimMiddleware, {
  devicesReducer,
} from '@denim/iot-platform-middleware-redux';
import env from './config';

const envVar = env();

const settingsProvider = {
  API_URL: envVar.BASE_API_URL,
};

const cacheProvider = {};

const store = configureStore({
  reducer: {
    devices: devicesReducer,
  },
  middleware: [...denimMiddleware(settingsProvider, cacheProvider)],
});

export {store};
