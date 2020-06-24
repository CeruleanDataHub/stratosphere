import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

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

const DeviceDashboard = ({devices: {all: allDevices}, url}) => {
  return (
    <div>
      <DashboardContainer id="dashboard" data-cy="dashboard-container-e2e-test">
        <CardDash>
          <Card>
            <div>
              <div>
                <div className="device-list-columns">
                  <span>Device Id</span>
                  <span>Edge Device Id</span>
                </div>
                <div>{toDevices(allDevices, url)}</div>
              </div>
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

const toDevices = (allDevices, url) => {
  return allDevices
    .filter(device => device.type === 'node')
    .map(({external_id: deviceId, parent: {external_id: parentId}}) => (
      <Link
        className="device-list-item"
        key={deviceId}
        to={`${url}/${deviceId}`}
        data-cy={`device-button-e2e-test-${deviceId}`}
      >
        <span>{deviceId}</span>
        <span>{parent && parentId}</span>
      </Link>
    ));
};

DeviceDashboard.propTypes = {
  devices: PropTypes.shape({
    all: PropTypes.array,
  }),
  url: PropTypes.string,
};

export default DeviceDashboard;
