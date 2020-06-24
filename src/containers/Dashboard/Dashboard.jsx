import React, {useEffect} from 'react';
import './Dashboard.css';
import {useRouteMatch} from 'react-router-dom';
import DeviceDashboard from './DeviceDashboard.jsx';
import {useSelector, useDispatch} from 'react-redux';
import {getAllDevices} from '@denim/iot-platform-middleware-redux';

const Dashboard = () => {
  const devices = useSelector(state => state.devices);

  const dispatch = useDispatch();

  let {url} = useRouteMatch();

  useEffect(() => {
    dispatch(getAllDevices());
  }, []);

  return <>{devices.all && <DeviceDashboard devices={devices} url={url} />}</>;
};

export default Dashboard;
