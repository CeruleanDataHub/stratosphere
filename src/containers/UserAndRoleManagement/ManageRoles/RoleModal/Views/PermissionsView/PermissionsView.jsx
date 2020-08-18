import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {DataTable} from '@ceruleandatahub/react-components';
import {filter} from 'lodash';

import permissionViewColumns from './permissionViewColumns';
import SearchBar from '../../../../SearchBar/SearchBar.jsx';
import deletePermissionInRole from '../../../getRoles/deletePermissionsForRole';
import {useAuth0} from '../../../../../../auth0-spa.jsx';
import updatePermissionsInRole from '../../../getRoles/updatePermissionsInRole';

import env from '../../../../../../config';

const {AUTH0_AUDIENCE} = env();

const PermissionsView = ({
  activeRoleID,
  permissionsForRole,
  allPermissions,
}) => {
  const [filterValue, setFilterValue] = useState('');
  const {getTokenSilently} = useAuth0();
  const [permissionList, setPermissionList] = useState(permissionsForRole);

  const permissionExists = permission => permissionNames.includes(permission);

  const handleRolePermissionChange = async (permission, id, body) => {
    const token = await getTokenSilently();

    if (permissionExists(permission)) {
      try {
        const filteredPermissions = filterPermissions(
          permissionList,
          permission,
        );

        setPermissionList(filteredPermissions);

        await deletePermissionInRole(token, id, body);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        setPermissionList([...permissionList, {permission_name: permission}]);

        await updatePermissionsInRole(token, id, body);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const permissionData = allPermissions
    .map(permission => permission)
    .filter(permission => permission.includes(filterValue));

  const permissionNames = permissionList.map(
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

      <DataTable
        data={permissionData}
        columns={permissionViewColumns(
          AUTH0_AUDIENCE,
          permissionExists,
          handleRolePermissionChange,
          activeRoleID,
        )}
      />
    </>
  );
};

const filterPermissions = (permissionsForRole, permissionToBeModified) =>
  filter(
    permissionsForRole,
    permission => permission.permission_name !== permissionToBeModified,
  );

PermissionsView.propTypes = {
  activeRoleID: PropTypes.string.isRequired,
  permissionsForRole: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      permission_name: PropTypes.string,
      resource_server_identifier: PropTypes.string,
      resource_server_name: PropTypes.string,
    }),
  ),
  allPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchForEntity: PropTypes.func,
};

export default PermissionsView;
