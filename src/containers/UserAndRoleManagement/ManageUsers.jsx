import React, {useState, useEffect, useRef} from 'react';
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
  Select,
  DataTable,
  useOutsideClick,
  Popover,
} from '@ceruleandatahub/react-components';

import {ProfileModal} from './ProfileModal.jsx';

import './ManageUsers.css';

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

const BorderLessButton = styled.span`
  border: 0px;
  transform: rotate(90deg);
`;

const PopoverOption = styled.div`
  display: flex;
  padding: 0.2em;
  min-width: 150px;
  cursor: pointer;
`;

const PopoverText = styled.div`
  text-align: left;
  margin-left: 10px;
`;

const ManageUsers = () => {
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
        // eslint-disable-next-line react/prop-types
        cell: ({id}) => <UserDataCell id={id} />,
      },
    ],
  };

  const {getTokenSilently} = useAuth0();
  const [profileModalOpenTab, setProfileModalOpenTab] = useState('');

  const [userData, setUserData] = useState(defaultUserData);
  const [filterText, setFilterText] = useState('');

  const envVar = env();
  const auth0ProxyUrl = envVar.AUTH0_PROXY_URL;

  const UserDataCell = ({id}) => {
    const moreRef = useRef(null);
    const popoverRef = useRef(null);
    const [popoverOpen, setPopoverOpen] = useState(false);

    useOutsideClick(popoverRef, () => setPopoverOpen(false));

    return (
      <>
        <Button
          onClick={() => setPopoverOpen(!popoverOpen)}
          ref={moreRef}
          as={BorderLessButton}
        >
          <Icon name="more-alt" />
        </Button>
        <Popover
          isOpen={popoverOpen}
          containerRef={moreRef}
          popoverRef={popoverRef}
        >
          <PopoverOption onClick={() => setProfileModalOpenTab('roles')}>
            <Icon name="chef-hat"></Icon>
            <PopoverText>Assign Roles</PopoverText>
          </PopoverOption>
          <PopoverOption onClick={() => setProfileModalOpenTab('groups')}>
            <Icon name="network"></Icon>
            <PopoverText>Assign Groups</PopoverText>
          </PopoverOption>
          <PopoverOption onClick={() => setProfileModalOpenTab('hierarchies')}>
            <Icon name="vector"></Icon>
            <PopoverText>Assign Hierarchies</PopoverText>
          </PopoverOption>
        </Popover>
      </>
    );
  };

  useEffect(() => {
    async function fetchData() {
      const users = await getUsers();
      const usersInfo = users.map((user, idx) => {
        return {
          id: idx,
          name: user.name,
          email: user.email || '',
          logins: user.logins_count,
          lastLogin: user.last_login,
        };
      });
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

  const handleSearchTextChange = ev => {
    setFilterText(ev.target.value);
  };

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
                  onChange={ev => {
                    handleSearchTextChange(ev);
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
      {profileModalOpenTab !== '' && (
        <ProfileModal isOpen tab={profileModalOpenTab} />
      )}
    </ManageUsersContainer>
  );
};

export default ManageUsers;
