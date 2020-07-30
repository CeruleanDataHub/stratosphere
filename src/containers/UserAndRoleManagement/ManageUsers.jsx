import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Axios from 'axios';
import {useAuth0} from '../../auth0-spa.jsx';
import env from '../../config';

import {
  Grid,
  Cell,
  Icon,
  Button,
  Typography,
  Input,
  Dropdown,
  DataTable,
} from '@ceruleandatahub/react-components';

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

const defaultUserData = {
  data: [],
  columns: [
    {id: 1, name: 'Name', selector: 'name'},
    {id: 2, name: 'Logins', selector: 'logins'},
    {id: 3, name: 'Last login', selector: 'lastLogin'},
  ],
};
const ManageUsers = () => {
  const {getTokenSilently} = useAuth0();
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(defaultUserData);

  const envVar = env();
  const auth0ProxyUrl = envVar.AUTH0_PROXY_URL;

  useEffect(() => {
    async function fetchData() {
      const users = await getUsers();
      console.log('USERS', users);
      const usersInfo = users.map((user, idx) => {
        return {
          id: idx,
          name: user.name,
          logins: user.logins_count,
          lastLogin: user.last_login,
        };
      });
      console.log('USERS Info', usersInfo);
      setUserData({
        ...userData,
        data: usersInfo,
      });
    }
    fetchData();
  }, []);

  const getUsers = async () => {
    const token = await getTokenSilently();
    return Axios.get(`${auth0ProxyUrl}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (res.data.status === 404) {
          console.log('Error fetching users');
        } else {
          const users = res.data.map(user => {
            user.roles = [];
            return user;
          });
          return users;
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  console.log('user data', userData);
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
          >
            <Grid columns="3fr 1fr 1fr">
              <Cell>
                <Input type="search" placeholder="Search" />
              </Cell>
              <Cell>
                <Dropdown
                  label="Customer name"
                  onClick={() => setSearchDropdownOpen(!searchDropdownOpen)}
                  isOpen={searchDropdownOpen}
                >
                  <ul>
                    <li>first</li>
                    <li>second</li>
                    <li>third</li>
                    <li>fourth</li>
                  </ul>
                </Dropdown>
              </Cell>
              <Cell>
                <Button type="submit" as={SearchButton}>
                  <Icon name="search" />
                  Search
                </Button>
              </Cell>
            </Grid>
          </form>
          <DataTable columns={userData.columns} data={userData.data} />
        </Cell>
      </Typography>
    </ManageUsersContainer>
  );
};

export default ManageUsers;
