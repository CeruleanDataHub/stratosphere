import PropTypes from 'prop-types';
import React, {useState} from 'react';

import PermissionListItem from './PermissionListItem.jsx';
import {DataTable} from '@ceruleandatahub/react-components';
import SearchBar from '../../../SearchBar/SearchBar.jsx';

const PermissionsView = ({permissionsForRole, allPermissions}) => {
  const [filterValue, setFilterValue] = useState('');

  const permissionViewColumns = [
    {
      id: '1',
      name: 'Permissions',
      selector: 'permissions',
      sortable: true,
      cell: function cell(permission) {
        return (
          <PermissionListItem
            name={permission}
            isChecked={permissionNames.includes(permission)}
          />
        );
      },
    },
  ];

  const permissionData = allPermissions
    .map(permission => permission)
    .filter(permission => permission.includes(filterValue));

  const permissionNames = permissionsForRole.map(
    ({permission_name}) => permission_name,
  );

  return (
    <>
      <SearchBar
        onChange={event => setFilterValue(event.target.value)}
        value={filterValue}
        showSearchButton={false}
        margin={16}
      />

      <DataTable data={permissionData} columns={permissionViewColumns} />
    </>
  );
};

PermissionsView.propTypes = {
  permissionsForRole: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      permission_name: PropTypes.string,
      resource_server_identifier: PropTypes.string,
      resource_server_name: PropTypes.string,
    }),
  ),
  allPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PermissionsView;
