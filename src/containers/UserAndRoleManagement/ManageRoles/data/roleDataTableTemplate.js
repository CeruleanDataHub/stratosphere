import React from 'react';

import EditButton from '../../EditButton/EditButton.jsx';

const actionsData = [
  {icon: 'chef-hat', text: 'Assign Permissions', modalToOpen: 'Permissions'},
];

const roleDataTableTemplate = ({setEditModalIsOpen, setActiveRole}) => [
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
        />
      );
    },
  },
];

export default roleDataTableTemplate;
