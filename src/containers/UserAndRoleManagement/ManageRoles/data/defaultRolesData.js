import React from 'react';

import ActionsCell from '../../ActionsCell/ActionsCell.jsx';
import {useAuth0} from '../../../../auth0-spa.jsx';
import getPermissionsForRole from '../getPermissions/getPermissionsForRole.js';

const actionsData = [
  {icon: 'chef-hat', text: 'Assign Permissions', modalToOpen: 'Permissions'},
];

const defaultRolesData = ({
  setRoleModalOpenTab,
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
        id: 4,
        name: '',
        selector: 'actions',
        cell: function cell(role) {
          return (
            <ActionsCell
              setModalOpenTab={setRoleModalOpenTab}
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
