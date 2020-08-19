import React from 'react';

import EditButton from '../../EditButton/EditButton.jsx';
import {useAuth0} from '../../../../auth0-spa.jsx';
import getPermissionsForRole from '../getPermissions/getPermissionsForRole.js';

const actionsData = [
  {icon: 'chef-hat', text: 'Assign Permissions', modalToOpen: 'Permissions'},
];

const defaultRolesData = ({
  setEditModalIsOpen,
  setActiveRole,
  setPermissionsForRole,
}) => {
  const {getTokenSilently} = useAuth0();

  const getPermissionsForActiveRole = async activeRole => {
    const token = await getTokenSilently();

    const permissionsForRole = await getPermissionsForRole(activeRole, token);
    setPermissionsForRole(permissionsForRole.data);
  };

  return {
    data: [],
    columns: [
      {
        id: 1,
        name: 'Name',
        selector: 'name',
        sortable: true,
      },
      {
        id: 2,
        name: 'Description',
        selector: 'description',
        sortable: true,
      },
      {
        id: 4,
        name: '',
        selector: 'actions',
        grow: 0,
        cell: function cell(role) {
          return (
            <EditButton
              setEditModalIsOpen={setEditModalIsOpen}
              setActive={setActiveRole}
              actionsData={actionsData}
              active={role}
              fetchForEntity={getPermissionsForActiveRole}
            />
          );
        },
      },
    ],
  };
};

export default defaultRolesData;
