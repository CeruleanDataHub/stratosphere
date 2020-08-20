import {DataTable, Typography} from '@ceruleandatahub/react-components';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

import {useAuth0} from '../../../auth0-spa.jsx';
import ManagementHeader from '../ManagementHeader/ManagementHeader.jsx';
import SearchBar from '../SearchBar/SearchBar.jsx';
import EditButton from '../EditButton/EditButton.jsx';
import getUsers from './getUsers/getUsers';
import {UserModal} from './UserModal.jsx';

const ManageUsersContainer = styled.section`
  margin: 0 8em 2em 18em;
  background-color: #ffffff;
`;

const ManageUsers = () => {
  const {getTokenSilently} = useAuth0();

  const [editProfileModalIsOpen, setEditProfileModalIsOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [activeUser, setActiveUser] = useState({});

  const defaultUserColumns = [
    {id: 1, name: 'Name', selector: 'name', grow: 4},
    {id: 2, name: 'Logins', selector: 'logins', grow: 2},
    {
      id: 3,
      name: 'Last login',
      selector: 'lastLogin',
      grow: 3,
    },
    {
      id: 4,
      name: 'Status',
      selector: 'blocked',
      cell: function cell(user) {
        return <div>{user.blocked ? 'Blocked' : 'Active'}</div>;
      },
      grow: 1,
    },
    {
      id: 5,
      name: '',
      selector: 'actions',
      grow: 1,
      cell: function cell(user) {
        return (
          <EditButton
            active={user}
            setActive={setActiveUser}
            setEditModalIsOpen={setEditProfileModalIsOpen}
          />
        );
      },
    },
  ];

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = await getTokenSilently();

      const users = await getUsers(token);

      setUserData(users);
    };

    fetchData();
  }, []);

  return (
    <ManageUsersContainer>
      <Typography fontFamily="openSans">
        <ManagementHeader
          createItemButtonText="Invite User"
          backButtonText="Manage Users"
          buttonAction={() => console.log('placeholder')}
        />

        <SearchBar
          onChange={event => setFilterText(event.target.value)}
          value={filterText}
        />

        <DataTable
          columns={defaultUserColumns}
          data={userData.filter(
            user =>
              user.name.toLowerCase().includes(filterText.toLowerCase()) ||
              user.email.toLowerCase().includes(filterText.toLowerCase()),
          )}
        />
      </Typography>

      {editProfileModalIsOpen && (
        <UserModal
          isOpen={editProfileModalIsOpen}
          editProfileModalIsOpen={editProfileModalIsOpen}
          setEditProfileModalIsOpen={setEditProfileModalIsOpen}
          user={activeUser}
          userData={userData}
          setUserData={setUserData}
        />
      )}
    </ManageUsersContainer>
  );
};

export default ManageUsers;
