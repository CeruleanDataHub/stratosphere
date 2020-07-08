import React, {useEffect} from 'react';
import {useRouteMatch} from 'react-router-dom';
import Devices from './Devices.jsx';
import {useSelector, useDispatch} from 'react-redux';
import {getAllDevices} from '@denim/iot-platform-middleware-redux';

import './DeviceContainer.css';

const DeviceContainer = () => {
  const devices = useSelector(state => state.devices);

  const dispatch = useDispatch();

  let {url} = useRouteMatch();
  url = url.replace(/\/+$/, ''); // remove trailing slashes (/) if any

  useEffect(() => {
    dispatch(getAllDevices());
  }, []);
  return <>{devices.all && <Devices devices={devices} url={url} />}</>;
};

export default DeviceContainer;
