import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useAuth0} from '../../../auth0-spa.jsx';

import {
  Button,
  Cell,
  DataTable,
  Grid,
  Icon,
  Input,
  Typography,
} from '@ceruleandatahub/react-components';

import {UserModal} from './UserModal.jsx';
import ActionsCell from '../ActionsCell/ActionsCell.jsx';

import './ManageUsers.css';
import getUsers from './getUsers/getUsers';

const ManageUsersContainer = styled.section`
  margin: 0 8em 2em 18em;
  background-color: #ffffff;
`;

const Content = styled.div`
  padding: 1rem;
`;

const IconMarginRight = styled.div`
  margin-right: 0.5rem;
`;

const GridContentRight = styled.div`
  grid-column-end: none;
`;

const ButtonWithIcon = styled.button`
  padding: 0.6rem;
  span {
    margin-right: 0.4rem;
  }
`;

const SearchButton = styled(ButtonWithIcon)`
  width: 100%;
`;

const actionsData = [
  {icon: 'chef-hat', text: 'Assign Roles', modalToOpen: 'Roles'},
  {icon: 'network', text: 'Assign Groups', modalToOpen: 'Groups'},
  {icon: 'vector', text: 'Assign Hierarchies', modalToOpen: 'Hierarchies'},
];

const ManageUsers = () => {
  const {getTokenSilently} = useAuth0();

  const [profileModalOpenTab, setProfileModalOpenTab] = useState('');

  const [filterText, setFilterText] = useState('');

  const cell = () => (
    <ActionsCell
      setModalOpenTab={setProfileModalOpenTab}
      actionsData={actionsData}
    />
  );

  const defaultUserData = {
    data: [],
    columns: [
      {id: 1, name: 'Name', selector: 'name'},
      {id: 2, name: 'Logins', selector: 'logins'},
      {
        id: 3,
        name: 'Last login',
        selector: 'lastLogin',
      },
      {
        id: 4,
        name: '',
        selector: 'actions',
        cell,
      },
    ],
  };

  const [userData, setUserData] = useState(defaultUserData);

  useEffect(() => {
    const fetchData = async () => {
      const token = await getTokenSilently();

      const users = await getUsers(token);
      const usersInfo = users.map(
        ({name, email, logins_count, last_login}, idx) => {
          return {
            id: idx,
            name,
            email: email || '',
            logins: logins_count,
            lastLogin: last_login,
          };
        },
      );

      setUserData({
        ...userData,
        data: usersInfo,
      });
    };

    fetchData();
  }, []);

  return (
    <ManageUsersContainer>
      <Typography fontFamily="openSans">
        <Cell as={Content}>
          <Grid>
            <Cell>
              <Typography color="black" size="large">
                <Icon name="arrow-left-circle" as={IconMarginRight} />
                Manage Users
              </Typography>
            </Cell>
            <Cell as={GridContentRight}>
              <Button as={ButtonWithIcon}>
                <Icon name="plus" />
                Invite User
              </Button>
            </Cell>
          </Grid>
          <form
            onSubmit={event => {
              event.preventDefault();
              console.log('submit');
            }}
            className="searchUser"
          >
            <Grid columns="4fr 1fr">
              <Cell>
                <Input
                  type="search"
                  placeholder="Search"
                  value={filterText}
                  onChange={event => {
                    setFilterText(event);
                  }}
                />
              </Cell>

              <Cell>
                <Button type="submit" as={SearchButton}>
                  <Icon name="search" />
                  Search
                </Button>
              </Cell>
            </Grid>
          </form>
          <DataTable
            columns={userData.columns}
            data={userData.data.filter(
              user =>
                user.name.toLowerCase().includes(filterText.toLowerCase()) ||
                user.email.toLowerCase().includes(filterText.toLowerCase()),
            )}
          />
        </Cell>
      </Typography>
      <UserModal
        isOpen={profileModalOpenTab !== ''}
        profileModalOpenTab={profileModalOpenTab}
        setProfileModalOpenTab={setProfileModalOpenTab}
      />
    </ManageUsersContainer>
  );
};

export default ManageUsers;
