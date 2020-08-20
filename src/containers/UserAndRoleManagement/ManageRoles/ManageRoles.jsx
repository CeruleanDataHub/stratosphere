import {getAllRoles} from '@ceruleandatahub/middleware-redux';
import {DataTable, Typography} from '@ceruleandatahub/react-components';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';

import ManagementHeader from '../ManagementHeader/ManagementHeader.jsx';
import SearchBar from '../SearchBar/SearchBar.jsx';
import CreateNewRoleModal from './CreateNewRoleModal/CreateNewRoleModal.jsx';
import roleDataTableTemplate from './data/roleDataTableTemplate';
import RoleModal from './RoleModal/RoleModal.jsx';

const ManageRolesContainer = styled.section`
  margin: 0 8em 2em 18em;
  background-color: #ffffff;
`;

const ManageRoles = () => {
  const dispatch = useDispatch();

  const roles = useSelector(({roles}) => roles);

  const [filterText, setFilterText] = useState('');
  const [activeRole, setActiveRole] = useState({name: ''});
  const [permissionsForRole, setPermissionsForRole] = useState([]);
  const [createNewRoleModalIsOpen, setCreateNewRoleModalIsOpen] = useState(
    false,
  );
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllRoles());
  }, [createNewRoleModalIsOpen]);

  const handleCreateNewRoleModalClose = () => {
    setCreateNewRoleModalIsOpen(false);
    setNewRoleDescription('');
    setNewRoleName('');
  };

  return (
    <ManageRolesContainer>
      <Typography fontFamily="openSans">
        <ManagementHeader
          createItemButtonText="Create Role"
          backButtonText="Manage Roles"
          buttonAction={() => setCreateNewRoleModalIsOpen(true)}
        />

        <SearchBar
          value={filterText}
          onChange={event => setFilterText(event.target.value)}
        />

        {roles.all && (
          <DataTable
            columns={roleDataTableTemplate({
              setActiveRole,
              activeRole,
              setPermissionsForRole,
              setEditModalIsOpen,
            })}
            data={roles.all.filter(role =>
              role.name.toLowerCase().includes(filterText.toLowerCase()),
            )}
          />
        )}

        {editModalIsOpen && (
          <RoleModal
            isOpen={editModalIsOpen}
            setEditModalIsOpen={setEditModalIsOpen}
            activeRole={activeRole}
            permissionsForRole={permissionsForRole}
          />
        )}

        <CreateNewRoleModal
          closeModal={() => handleCreateNewRoleModalClose()}
          isOpen={createNewRoleModalIsOpen}
          newRoleName={newRoleName}
          setNewRoleName={setNewRoleName}
          newRoleDescription={newRoleDescription}
          setNewRoleDescription={setNewRoleDescription}
        />
      </Typography>
    </ManageRolesContainer>
  );
};

export default ManageRoles;
