import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import PermissionListItem from './PermissionListItem.jsx';

const PermissionsList = styled.ul`
  list-style: none;
  padding-left: 0.5em;
`;

const PermissionsView = ({permissions}) => (
  <PermissionsList>
    {permissions.map(({permission_name, enabled}, key) => (
      <PermissionListItem name={permission_name} enabled={enabled} key={key} />
    ))}
  </PermissionsList>
);

PermissionsView.propTypes = {
  permissions: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      permission_name: PropTypes.string,
      resource_server_identifier: PropTypes.string,
      resource_server_name: PropTypes.string,
    }),
  ),
};

export default PermissionsView;
