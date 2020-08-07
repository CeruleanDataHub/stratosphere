import React, {useEffect, useState} from 'react';
import {DataTable, Typography} from '@ceruleandatahub/react-components';
import styled from 'styled-components';
import ActionsCell from '../ActionsCell/ActionsCell.jsx';
import getAllRoles from './getRoles/getRoles';
import {useAuth0} from '../../../auth0-spa.jsx';
import SearchBar from '../SearchBar/SearchBar.jsx';
import ManagementHeader from '../ManagementHeader/ManagementHeader.jsx';

const ManageRolesContainer = styled.section`
  margin: 0 8em 2em 18em;
  background-color: #ffffff;
`;

const actionsData = [
  {icon: 'chef-hat', text: 'Assign Permissions', modalToOpen: 'Permissions'},
];

const setModalOpenTab = () => {};

const cell = () => (
  <ActionsCell setModalOpenTab={setModalOpenTab} actionsData={actionsData} />
);

const defaultRolesData = {
  data: [],
  columns: [
    {id: 1, name: 'Name', selector: 'name'},
    {id: 2, name: 'Users', selector: 'users'},
    {
      id: 3,
      name: 'Permissions',
      selector: 'permissions',
    },
    {
      id: 4,
      name: '',
      selector: 'actions',
      cell,
    },
  ],
};

const ManageRoles = () => {
  const {getTokenSilently} = useAuth0();
  const [roleData, setRoleData] = useState(defaultRolesData);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    const getRoles = async () => {
      const token = await getTokenSilently();

      const roles = await getAllRoles(token);

      setRoleData({
        ...roleData,
        data: roles,
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
      </Typography>
    </ManageRolesContainer>
  );
};

export default ManageRoles;
