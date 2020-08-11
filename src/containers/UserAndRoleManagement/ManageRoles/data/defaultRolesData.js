import ActionsCell from '../../ActionsCell/ActionsCell.jsx';
import React from 'react';

const actionsData = [
  {icon: 'chef-hat', text: 'Assign Permissions', modalToOpen: 'Permissions'},
];

const defaultRolesData = ({setRoleModalOpenTab}) => {
  return {
    data: [],
    columns: [
      {
        id: 1,
        name: 'Name',
        selector: 'name',
      },
      {
        id: 2,
        name: 'Users',
        selector: 'users',
      },
      {
        id: 3,
        name: 'Permissions',
        selector: 'permissions',
      },
      {
        id: 4,
        name: '',
        selector: 'actions',
        cell: function cell() {
          return (
            <ActionsCell
              setModalOpenTab={setRoleModalOpenTab}
              actionsData={actionsData}
            />
          );
        },
      },
    ],
  };
};

export default defaultRolesData;
