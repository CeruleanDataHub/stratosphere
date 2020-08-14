import React from 'react';
import PermissionListItem from './PermissionListItem.jsx';

const permissionViewColumns = (
  AUTH0_AUDIENCE,
  permissionExists,
  handleRolePermissionChange,
  activeRoleID,
  setRoleData,
  roleData,
) => [
  {
    id: '1',
    name: 'Permissions',
    selector: 'permissions',
    sortable: true,
    cell: function cell(permission) {
      const permissionToBeModified = {
        permissions: [
          {
            permission_name: permission,
            resource_server_identifier: AUTH0_AUDIENCE,
          },
        ],
      };

      return (
        <PermissionListItem
          name={permission}
          isChecked={permissionExists(permission)}
          changePermissions={() =>
            handleRolePermissionChange(
              permission,
              activeRoleID,
              permissionToBeModified,
            )
          }
          setRoleData={setRoleData}
          roleData={roleData}
        />
      );
    },
  },
];

export default permissionViewColumns;
