import React from 'react';
import styled from 'styled-components';

const Notification = styled.div`
  margin-left: 20em;
  margin-right: 2em;
  padding: 1em;
  border: 1px solid #000000;
  background-color: #ffffff;
`;

export default class NotificationPanel extends React.Component {
  render() {
    return <Notification id="notification">{this.props.text}</Notification>;
  }
}
