import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {DataTable} from '@ceruleandatahub/react-components';
import {find, get, filter} from 'lodash';

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
  setRoleData,
  roleData,
}) => {
  const [filterValue, setFilterValue] = useState('');
  const {getTokenSilently} = useAuth0();
  const [permissionList, setPermissionList] = useState(permissionsForRole);

  const permissionExists = permission => permissionNames.includes(permission);

  const handleRolePermissionChange = async (permission, id, body) => {
    const token = await getTokenSilently();

    if (permissionExists(permission)) {
      try {
        await deletePermissionInRole(token, id, body);

        const activeRole = findActiveRole(roleData, activeRoleID);

        const permissionToBeModified = getPermissionToBeModified(
          roleData,
          activeRoleID,
          permission,
        );

        const allPermissionsForActiveRole = getAllPermissionsForActiveRole(
          activeRole,
        );

        const filteredPermissions = filterPermissions(
          allPermissionsForActiveRole,
          permissionToBeModified,
        );

        const newActiveRole = populateNewActiveRole(
          activeRole,
          filteredPermissions,
        );

        const oldActiveRoleFilteredFromRoleData = filterOldActiveRoleFromRoleData(
          roleData,
          activeRoleID,
        );

        const newRoleData = populateNewRoleData(
          roleData,
          newActiveRole,
          oldActiveRoleFilteredFromRoleData,
        );

        setRoleData(newRoleData);
        setPermissionList(filteredPermissions);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await updatePermissionsInRole(token, id, body);

        const activeRole = findActiveRole(roleData, activeRoleID);

        const permissionToBeModified = getPermissionToBeModified(
          roleData,
          activeRoleID,
          permission,
        );

        const allPermissionsForActiveRole = getAllPermissionsForActiveRole(
          activeRole,
        );

        const permissionsWithNewPermission = populatePermissionsWithNewPermission(
          permissionToBeModified,
          allPermissionsForActiveRole,
        );

        const newActiveRole = populateNewActiveRole(
          activeRole,
          permissionsWithNewPermission,
        );

        const oldActiveRoleFilteredFromRoleData = filterOldActiveRoleFromRoleData(
          roleData,
          activeRoleID,
        );

        const newRoleData = populateNewRoleData(
          roleData,
          newActiveRole,
          oldActiveRoleFilteredFromRoleData,
        );

        setRoleData(newRoleData);
        setPermissionList(permissionsWithNewPermission);
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

const populatePermissionsWithNewPermission = (
  permissionToBeModified,
  allPermissionsForActiveRole,
) => [
  ...allPermissionsForActiveRole,
  {permission_name: permissionToBeModified},
];

const populateNewActiveRole = (activeRole, newPermissions) => ({
  ...activeRole,
  permissions: newPermissions.length,
  permissionsForModal: newPermissions,
});

const populateNewRoleData = (
  roleData,
  newActiveRole,
  oldActiveRoleFilteredFromRoleData,
) => ({
  ...roleData,
  data: [...oldActiveRoleFilteredFromRoleData, newActiveRole],
});

const filterPermissions = (
  allPermissionsForActiveRole,
  permissionToBeModified,
) =>
  filter(
    allPermissionsForActiveRole,
    permission =>
      permission.permission_name !== permissionToBeModified.permission_name,
  );

const filterOldActiveRoleFromRoleData = (roleData, activeRoleID) =>
  filter(roleData.data, role => role.id !== activeRoleID);

const getAllPermissionsForActiveRole = activeRole =>
  get(activeRole, 'permissionsForModal');

const findActiveRole = (roleData, activeRoleID) =>
  find(roleData.data, ['id', activeRoleID]);

const getPermissionToBeModified = (roleData, activeRoleID, permission) => {
  const activeRole = findActiveRole(roleData, activeRoleID);

  const allPermissionsForActiveRole = getAllPermissionsForActiveRole(
    activeRole,
  );

  const findExistingPermission = find(allPermissionsForActiveRole, [
    'permission_name',
    permission,
  ]);

  return findExistingPermission || permission;
};

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
  setRoleData: PropTypes.func.isRequired,
  roleData: PropTypes.shape({
    data: PropTypes.array.isRequired,
  }),
};

export default PermissionsView;
