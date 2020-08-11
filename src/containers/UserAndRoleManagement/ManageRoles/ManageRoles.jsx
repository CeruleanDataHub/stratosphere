import React, {useEffect, useState} from 'react';
import {DataTable, Typography} from '@ceruleandatahub/react-components';
import styled from 'styled-components';

import {useAuth0} from '../../../auth0-spa.jsx';
import getAllRolesWithPermissionsAndUsers from './getRoles/getRoles';

import SearchBar from '../SearchBar/SearchBar.jsx';
import ManagementHeader from '../ManagementHeader/ManagementHeader.jsx';
import RoleModal from './RoleModal/RoleModal.jsx';

import defaultRolesData from './data/defaultRolesData';

const ManageRolesContainer = styled.section`
  margin: 0 8em 2em 18em;
  background-color: #ffffff;
`;

const ManageRoles = () => {
  const {getTokenSilently} = useAuth0();

  const [roleModalOpenTab, setRoleModalOpenTab] = useState('');
  const [filterText, setFilterText] = useState('');
  const [activeRole, setActiveRole] = useState('');
  const [roleData, setRoleData] = useState(
    defaultRolesData({setRoleModalOpenTab, setActiveRole, activeRole}),
  );

  useEffect(() => {
    const getRoles = async () => {
      const token = await getTokenSilently();

      const roles = await getAllRolesWithPermissionsAndUsers(token);

      const newRoles = roles.map(role => ({
        ...role,
        permissions: role.permissions.length,
        users: role.users.length,
      }));

      setRoleData({
        ...roleData,
        data: newRoles,
      });
    };

    getRoles();
  }, []);

  return (
    <ManageRolesContainer>
      <Typography fontFamily="openSans">
        <ManagementHeader
          createItemButtonText="Create Role"
          backButtonText="Manage Roles"
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
          name={activeRole}
        />
      </Typography>
    </ManageRolesContainer>
  );
};

export default ManageRoles;
