import {DataTable, Typography} from '@ceruleandatahub/react-components';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

import {useAuth0} from '../../../auth0-spa.jsx';
import ActionsCell from '../ActionsCell/ActionsCell.jsx';
import ManagementHeader from '../ManagementHeader/ManagementHeader.jsx';
import SearchBar from '../SearchBar/SearchBar.jsx';
import getUsers from './getUsers/getUsers';
import {UserModal} from './UserModal.jsx';

const ManageUsersContainer = styled.section`
  margin: 0 8em 2em 18em;
  background-color: #ffffff;
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
  const [activeUser, setActiveUser] = useState({});

  const cell = user => {
    user.id = user.id.toString();

    return (
      <ActionsCell
        setModalOpenTab={setProfileModalOpenTab}
        actionsData={actionsData}
        setActive={setActiveUser}
        active={user}
      />
    );
  };

  const defaultUserData = {
    data: [],
    columns: [
      {id: 1, name: 'Name', selector: 'name', sortable: true},
      {id: 2, name: 'Logins', selector: 'logins', sortable: true},
      {
        id: 3,
        name: 'Last login',
        selector: 'lastLogin',
        sortable: true,
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

      setUserData({
        ...userData,
        data: users,
      });
    };

    fetchData();
  }, []);

  return (
    <ManageUsersContainer>
      <Typography fontFamily="openSans">
        <ManagementHeader
          createItemButtonText="Invite User"
          backButtonText="Manage Users"
        />

        <SearchBar
          onChange={event => setFilterText(event.target.value)}
          value={filterText}
        />

        <DataTable
          columns={userData.columns}
          data={userData.data.filter(
            user =>
              user.name.toLowerCase().includes(filterText.toLowerCase()) ||
              user.email.toLowerCase().includes(filterText.toLowerCase()),
          )}
        />
      </Typography>

      <UserModal
        isOpen={profileModalOpenTab !== ''}
        profileModalOpenTab={profileModalOpenTab}
        setProfileModalOpenTab={setProfileModalOpenTab}
        activeUser={activeUser}
      />
    </ManageUsersContainer>
  );
};

export default ManageUsers;
