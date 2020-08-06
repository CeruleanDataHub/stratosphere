import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import Axios from 'axios';
import {useAuth0} from '../../auth0-spa.jsx';
import env from '../../config';
import PropTypes from 'prop-types';

import {
  Grid,
  Cell,
  Icon,
  Button,
  Typography,
  Input,
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

const BorderlessButton = styled.span`
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

const UserDataCell = ({setProfileModalOpenTab}) => {
  const moreRef = useRef(null);
  const popoverRef = useRef(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useOutsideClick(popoverRef, () => setPopoverOpen(false));

  return (
    <>
      <Button
        onClick={() => setPopoverOpen(!popoverOpen)}
        ref={moreRef}
        as={BorderlessButton}
      >
        <Icon name="more-alt" />
      </Button>
      <Popover
        isOpen={popoverOpen}
        containerRef={moreRef}
        popoverRef={popoverRef}
      >
        <PopoverOption onClick={() => setProfileModalOpenTab('Roles')}>
          <Icon name="chef-hat" />
          <PopoverText>Assign Roles</PopoverText>
        </PopoverOption>
        <PopoverOption onClick={() => setProfileModalOpenTab('Groups')}>
          <Icon name="network" />
          <PopoverText>Assign Groups</PopoverText>
        </PopoverOption>
        <PopoverOption onClick={() => setProfileModalOpenTab('Hierarchies')}>
          <Icon name="vector" />
          <PopoverText>Assign Hierarchies</PopoverText>
        </PopoverOption>
      </Popover>
    </>
  );
};

UserDataCell.propTypes = {
  setProfileModalOpenTab: PropTypes.func.isRequired,
};

const ManageUsers = () => {
  const {getTokenSilently} = useAuth0();

  const [profileModalOpenTab, setProfileModalOpenTab] = useState('');

  const [filterText, setFilterText] = useState('');
  const envVar = env();

  const auth0ProxyUrl = `${envVar.BASE_API_URL}/auth0`;

  const cell = () => {
    return <UserDataCell setProfileModalOpenTab={setProfileModalOpenTab} />;
  };

  cell.propTypes = {
    setProfileModalOpenTab: PropTypes.func.isRequired,
  };

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
      <ProfileModal
        isOpen={profileModalOpenTab !== ''}
        profileModalOpenTab={profileModalOpenTab}
        setProfileModalOpenTab={setProfileModalOpenTab}
      />
    </ManageUsersContainer>
  );
};

export default ManageUsers;
