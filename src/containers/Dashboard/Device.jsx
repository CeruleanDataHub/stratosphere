import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import io from 'socket.io-client';
import env from '../../config';
import NotificationPanel from '../NotificationPanel/NotificationPanel.jsx';

import './Device.css';

const Device = props => {
  let {deviceId} = useParams();
  let [deviceData, setDeviceData] = useState('');

  useEffect(() => {
    let socket;
    let cancelled = false;
    if (!cancelled) {
      const envVar = env();

      socket = io(envVar.BASE_API_URL);
      const data = {
        deviceId,
      };
      socket.emit('UPDATE_DEVICE_SELECTION', {
        ...data,
        prop: 'ADD',
      });
      socket.on('DEVICE_DATA', deviceData => {
        setDeviceData(deviceData);
      });
      return function () {
        socket.emit('UPDATE_DEVICE_SELECTION', {
          ...data,
          prop: 'REMOVE',
        });
      };
    }
    return () => {
      cancelled = true;
      socket.close();
    };
  }, []);

  return (
    <div>
      <NotificationPanel text={deviceData.level}> </NotificationPanel>
      <div className="device-detail">{deviceId}</div>
    </div>
  );
};

export default Device;
