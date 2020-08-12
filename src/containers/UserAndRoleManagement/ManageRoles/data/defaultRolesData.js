import React from 'react';

import ActionsCell from '../../ActionsCell/ActionsCell.jsx';

const actionsData = [
  {icon: 'chef-hat', text: 'Assign Permissions', modalToOpen: 'Permissions'},
];

const defaultRolesData = ({setRoleModalOpenTab, setActiveRole}) => {
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
        name: 'Users',
        selector: 'users',
        sortable: true,
      },
      {
        id: 3,
        name: 'Permissions',
        selector: 'permissions',
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
            />
          );
        },
      },
    ],
  };
};

export default defaultRolesData;
