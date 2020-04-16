import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import Axios from 'axios';
import io from 'socket.io-client';
import {useRouteMatch, Link, Switch, Route} from 'react-router-dom';
import Device from './Device.jsx';

const DashboardContainer = styled.section`
  margin-left: 18em;
  display: grid;
  grid-template-columns: auto auto auto;
`;

const CardDash = styled.div`
  margin: 2em;
  border-radius: 0.5em;
  border: 2px dashed #ffffff;
`;

const Card = styled.div`
  margin: 1em;
  border-radius: 0.25em;
  border: 1px solid #000000;
  background-color: #ffffff;
  height: 20em;
`;

const apiUrl = process.env.BASE_API_URL;
console.log('API_URL ', apiUrl);
const Dashboard = () => {
  const [iotDevices, setIotDevices] = useState([]);
  let {url} = useRouteMatch();

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const resp = await Axios.get(`${apiUrl}/api/devices`);
        setIotDevices(resp.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchDevices();
  }, []);

  return (
    <div>
      <DashboardContainer id="dashboard">
        <CardDash>
          <Card>
            <div>
              {iotDevices && (
                <div>
                  <div className="device-list-columns">
                    <span> Device Id</span>
                    <span>Edge Device Id</span>
                  </div>
                  <div>
                    {iotDevices.map(resource => (
                      <Link
                        className="device-list-item"
                        key={resource.id}
                        to={`${url}/${resource.id}`}
                      >
                        <span>{resource.id}</span>
                        <span>{resource.edge_device_id}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </CardDash>
        <CardDash>
          <Card>THIS IS A CARD</Card>
        </CardDash>
      </DashboardContainer>
    </div>
  );
};
export default Dashboard;
