import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {useAuth0} from './auth0-spa.jsx';

import 'normalize.css';
import './application.css';

const Main = styled.article`
  display: grid;
  min-height: 100vh;
  background-image: url(${props => props.image});
  background-repeat: no-repeat;
  background-color: #ffffff;
  background-attachment: fixed;
  background-position: left -15em;
  grid-template-rows: 10% auto;
`;

const Application = props => {
  const {loading} = useAuth0();
  // const [notificationStatus, setNotificationStatus] = useState(null);

  if (loading) {
    return <div> Loading... </div>;
  }

  return <Main id="app">{props.children}</Main>;
};

Application.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Application;
