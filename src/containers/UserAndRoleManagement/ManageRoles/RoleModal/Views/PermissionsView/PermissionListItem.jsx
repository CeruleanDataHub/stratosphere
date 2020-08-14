import {Checkbox} from '@ceruleandatahub/react-components';
import PropTypes from 'prop-types';
import React from 'react';

const PermissionListItem = ({changePermissions, isChecked, name}) => (
  <>
    <Checkbox checked={isChecked} onChange={changePermissions} /> {name}
  </>
);

PermissionListItem.propTypes = {
  changePermissions: PropTypes.func.isRequired,
  isChecked: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
};

export default PermissionListItem;
