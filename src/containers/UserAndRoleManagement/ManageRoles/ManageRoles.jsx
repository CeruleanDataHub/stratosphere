import React, {useEffect, useState} from 'react';
import {
  Button,
  Cell,
  DataTable,
  Grid,
  Icon,
  Typography,
} from '@ceruleandatahub/react-components';
import styled from 'styled-components';
import ActionsCell from '../ActionsCell/ActionsCell.jsx';
import getAllRoles from './getRoles/getRoles';
import {useAuth0} from '../../../auth0-spa.jsx';
import SearchBar from '../SearchBar/SearchBar.jsx';

const IconMarginRight = styled.div`
  margin-right: 0.5rem;
`;

const GridContentRight = styled.div`
  grid-column-end: none;
`;

const ManageRolesContainer = styled.section`
  margin: 0 8em 2em 18em;
  background-color: #ffffff;
`;

const ButtonWithIcon = styled.button`
  padding: 0.6rem;
  span {
    margin-right: 0.4rem;
  }
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
      <Grid>
        <Cell>
          <Typography color="black" size="large">
            <Icon name="arrow-left-circle" as={IconMarginRight} />
            Manage Roles
          </Typography>
        </Cell>

        <Cell as={GridContentRight}>
          <Button as={ButtonWithIcon}>
            <Icon name="plus" />
            Create Role
          </Button>
        </Cell>
      </Grid>

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
    </ManageRolesContainer>
  );
};

export default ManageRoles;
