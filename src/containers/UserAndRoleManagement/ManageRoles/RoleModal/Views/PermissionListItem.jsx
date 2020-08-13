import {Checkbox} from '@ceruleandatahub/react-components';
import PropTypes from 'prop-types';
import React from 'react';

const PermissionListItem = ({isChecked, name}) => {
  return (
    <>
      <Checkbox checked={isChecked} onChange={() => console.log('change')} />{' '}
      {name}
    </>
  );
};

PermissionListItem.propTypes = {
  isChecked: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
};

export default PermissionListItem;
