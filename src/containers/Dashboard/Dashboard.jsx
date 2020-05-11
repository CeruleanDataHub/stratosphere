import React, {useEffect} from 'react';
import styled from 'styled-components';
import {useRouteMatch, Link} from 'react-router-dom';
import './Dashboard.css';
import {useSelector, useDispatch} from 'react-redux';
import {getAllDevices} from '@denim/iot-platform-middleware-redux';

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

const Dashboard = () => {
  let {url} = useRouteMatch();

  const devices = useSelector(state => state.devices);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllDevices());
  }, []);

  return (
    <div>
      <DashboardContainer id="dashboard">
        <CardDash>
          <Card>
            <div>
              {devices.all && (
                <div>
                  <div className="device-list-columns">
                    <span> Device Id</span>
                    <span>Edge Device Id</span>
                  </div>
                  <div>
                    {devices.all.map(resource => (
                      <Link
                        className="device-list-item"
                        key={resource.id}
                        to={`${url}/${resource.id}`}
                      >
                        <span>{resource.id}</span>
                        <span>
                          {resource.edgeDevice && resource.edgeDevice.id}
                        </span>
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
