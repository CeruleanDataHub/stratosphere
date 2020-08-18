import {DataTable, Typography} from '@ceruleandatahub/react-components';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

import {useAuth0} from '../../../auth0-spa.jsx';
import ManagementHeader from '../ManagementHeader/ManagementHeader.jsx';
import SearchBar from '../SearchBar/SearchBar.jsx';
import defaultRolesData from './data/defaultRolesData';
import getAllRoles from './getRoles/getRoles';
import RoleModal from './RoleModal/RoleModal.jsx';
import CreateNewRoleModal from './CreateNewRoleModal/CreateNewRoleModal.jsx';

const ManageRolesContainer = styled.section`
  margin: 0 8em 2em 18em;
  background-color: #ffffff;
`;

const ManageRoles = () => {
  const {getTokenSilently} = useAuth0();

  const [roleModalOpenTab, setRoleModalOpenTab] = useState('');
  const [filterText, setFilterText] = useState('');
  const [activeRole, setActiveRole] = useState({name: ''});
  const [permissionsForRole, setPermissionsForRole] = useState([]);
  const [roleData, setRoleData] = useState(
    defaultRolesData({
      setRoleModalOpenTab,
      setActiveRole,
      activeRole,
      setPermissionsForRole,
    }),
  );
  const [createNewRoleModalIsOpen, setCreateNewRoleModalIsOpen] = useState(
    false,
  );
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');

  useEffect(() => {
    const getRoles = async () => {
      const token = await getTokenSilently();

      const roles = await getAllRoles(token);

      setRoleData({
        ...roleData,
        data: roles.data,
      });
    };

    getRoles();
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

        <DataTable
          columns={roleData.columns}
          data={roleData.data.filter(role =>
            role.name.toLowerCase().includes(filterText.toLowerCase()),
          )}
        />

        <RoleModal
          isOpen={roleModalOpenTab !== ''}
          roleModalOpenTab={roleModalOpenTab}
          setRoleModalOpenTab={setRoleModalOpenTab}
          activeRole={activeRole}
          setRoleData={setRoleData}
          roleData={roleData}
          permissionsForRole={permissionsForRole}
        />

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
