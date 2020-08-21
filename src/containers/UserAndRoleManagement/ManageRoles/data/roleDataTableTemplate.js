import React from 'react';

import CellControl from '../../CellControl/CellControl.jsx';
import DeleteButton from '../../CellControl/ControlButton/DeleteButton/DeleteButton.jsx';
import EditButton from '../../CellControl/ControlButton/EditButton/EditButton.jsx';

const roleDataTableTemplate = ({
  setEditModalIsOpen,
  setActiveRole,
  setDeleteConfirmIsOpen,
}) => [
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
        <CellControl>
          <EditButton
            setEditModalIsOpen={setEditModalIsOpen}
            setActive={setActiveRole}
            active={role}
          />

          <DeleteButton
            setDeleteConfirmIsOpen={setDeleteConfirmIsOpen}
            setActive={setActiveRole}
            active={role}
          />
        </CellControl>
      );
    },
  },
];

export default roleDataTableTemplate;
