import {Button, Icon} from '@ceruleandatahub/react-components';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const ControlButtonWrapper = styled.button`
  border: 0;
  padding: 0;
  font-size: 1.25em;
  color: ${({color}) => color};
`;

const ControlButton = ({onClick, icon, color}) => (
  <Button onClick={onClick} color={color} as={ControlButtonWrapper}>
    <Icon name={icon} />
  </Button>
);

ControlButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string,
};

ControlButton.defaultProps = {
  color: 'black',
};

export default ControlButton;
