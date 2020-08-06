import {Icon} from '@ceruleandatahub/react-components';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const PopoverOption = styled.div`
  display: flex;
  padding: 0.2em;
  min-width: 150px;
  cursor: pointer;
`;

const PopoverText = styled.div`
  text-align: left;
  margin-left: 10px;
`;

const Action = ({onClick, text, icon}) => (
  <PopoverOption onClick={onClick}>
    <Icon name={icon} />
    <PopoverText>{text}</PopoverText>
  </PopoverOption>
);

Action.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

export default Action;
