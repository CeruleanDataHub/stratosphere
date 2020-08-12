import {Checkbox} from '@ceruleandatahub/react-components';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import styled from 'styled-components';

const ListItem = styled.li`
  display: flex;
  align-items: center;
  line-height: 1.75;
`;

const PermissionListItem = ({enabled, name}) => {
  const [isChecked, setIsChecked] = useState(enabled);

  return (
    <ListItem>
      <Checkbox checked={isChecked} onChange={() => setIsChecked(!isChecked)} />{' '}
      {name}
    </ListItem>
  );
};

PermissionListItem.propTypes = {
  enabled: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
};

export default PermissionListItem;
