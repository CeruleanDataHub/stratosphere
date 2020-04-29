import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Notification = styled.div`
  padding: 1em;
  border: 1px solid #000000;
  background-color: #ffffff;
`;

class NotificationPanel extends React.Component {
  render() {
    return <Notification id="notification">{this.props.text}</Notification>;
  }
}

NotificationPanel.propTypes = {
  text: PropTypes.string,
};

export default NotificationPanel;
