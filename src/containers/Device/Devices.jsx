import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledDevices = styled.section`
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

const Devices = ({devices: {all: allDevices}, url}) => {
  return (
    <div>
      <StyledDevices id="dashboard" data-cy="dashboard-container-e2e-test">
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
      </StyledDevices>
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
        data-cy={`device-link-e2e-test`}
      >
        <span>{deviceId}</span>
        <span>{parent && parentId}</span>
      </Link>
    ));
};

Devices.propTypes = {
  devices: PropTypes.shape({
    all: PropTypes.array,
  }),
  url: PropTypes.string,
};

export default Devices;
