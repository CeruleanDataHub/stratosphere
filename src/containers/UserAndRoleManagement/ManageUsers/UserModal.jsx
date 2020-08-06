import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import styled from 'styled-components';
import {
  Button,
  Cell,
  Grid,
  Icon,
  Tab,
  DataTable,
  Select,
  Typography,
} from '@ceruleandatahub/react-components';
import Modal from 'styled-react-modal';
import {Confirm} from '../ConfirmUser.jsx';
import {useAuth0} from '../../../auth0-spa.jsx';

import env from '../../../config';
import HierarchyTab from '../HierarchyTab.jsx';

const StyledModal = Modal.styled`
    display: flex;
    background-color: white;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 0 18px -3px rgba(27, 27, 27, 0.8);
    width: 75%;
    border: 1px solid red;
`;

const GridContentRight = styled.div`
  grid-column-end: none;
`;
const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid black;
`;
const TextRightDiv = styled.div`
  width: 100%;
  text-align: right;
`;

const BiggerIcon = styled.span`
  margin: 20px;
  font-size: 50px;
`;

const StyledCell = styled(Cell)`
  width: 300px;
  margin: 10px 0 10px auto;
`;

const StyledButton = styled.button`
  margin: 10px;
  height: 40px;
`;

const BlockDeleteButton = styled.button`
  width: 150px;
`;

const BlockDeleteText = styled.span`
  margin-left: 5px;
`;

const envVar = env();
const auth0ProxyUrl = `${envVar.BASE_API_URL}/auth0`;

export const UserModal = ({
  isOpen,
  profileModalOpenTab,
  setProfileModalOpenTab,
  user,
  userData,
  setUserData,
}) => {
  const {getTokenSilently} = useAuth0();
  const [roles, setRoles] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [selectedRoleToAdd, setSelectedRoleToAdd] = useState();
  const [isBlockUserModalOpen, setIsBlockUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);

  const manageUsersModalDataColumns = [
    {id: 1, name: 'Name', selector: 'name'},
    {id: 2, name: 'Description', selector: 'description'},
    {
      id: 3,
      name: '',
      selector: 'actions',
      // eslint-disable-next-line react/prop-types,react/display-name
      cell: ({id}) => <ModalDataTableToolCell id={id} />,
    },
  ];

  const getAllRoles = async () => {
    const token = await getTokenSilently();
    Axios.get(`${auth0ProxyUrl}/roles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (res.data.status === 404) {
          console.log('Error fetching roles');
        } else {
          setAllRoles(res.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const removeRoleFromTheUser = async roleId => {
    const token = await getTokenSilently();
    Axios.delete(`${auth0ProxyUrl}/users/${user.userId}/roles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {roles: [roleId]},
    }).then(() => {
      setRoles(roles.filter(role => role.id !== roleId));
    });
  };

  const addRoleToTheUser = async () => {
    const selectedRole = allRoles.find(role => role.name === selectedRoleToAdd);
    if (!selectedRole) return;

    const token = await getTokenSilently();
    await Axios.post(
      `${auth0ProxyUrl}/users/${user.userId}/roles`,
      {roles: [selectedRole.id]},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then(() => {
      const rolesCopy = [...roles];
      rolesCopy.push(selectedRole);
      setRoles(rolesCopy);
    });
  };

  // eslint-disable-next-line react/prop-types
  const ModalDataTableToolCell = ({id}) => (
    <Button onClick={() => removeRoleFromTheUser(id)}>
      <Icon name="trash" />
    </Button>
  );

  const populateRoles = async userId => {
    const token = await getTokenSilently();
    await Axios.get(`${auth0ProxyUrl}/users/${userId}/roles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(resp => {
      setRoles(resp.data);
    });
  };

  useEffect(() => {
    populateRoles(user.userId);
    getAllRoles();
  }, []);

  const getAvailableRoles = () => {
    const defaultOption = {id: 'placeholder', value: 'Select role'};
    return [
      defaultOption,
      ...allRoles
        .filter(role => !roles.some(r => r.id === role.id))
        .map(role => ({...role, value: role.name})),
    ];
  };

  const renderRolesTabContent = items => (
    <>
      <Grid columns="6fr 1fr">
        <StyledCell>
          <Select
            onChange={event => {
              setSelectedRoleToAdd(event.target.value);
            }}
            items={items}
            selectedOption={selectedRoleToAdd}
          />
        </StyledCell>
        <Cell>
          <Button as={StyledButton} onClick={() => addRoleToTheUser()}>
            Add role
          </Button>
        </Cell>
      </Grid>
      <DataTable columns={manageUsersModalDataColumns} data={roles} />
      <TextRightDiv>
        <a href="/manage">Manage Roles</a>
      </TextRightDiv>
    </>
  );

  const renderCurrentTab = () => {
    switch (profileModalOpenTab) {
      case 'Roles':
        return renderRolesTabContent(getAvailableRoles());

      case 'Hierarchies':
        return <HierarchyTab user={user} />;

      default:
        return <div></div>;
    }
  };

  const deleteUser = async () => {
    const token = await getTokenSilently();
    Axios.delete(`${auth0ProxyUrl}/users/${user.userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      const filteredUsers = [...userData].filter(u => u.userId !== user.userId);
      setUserData(filteredUsers);
      setIsBlockUserModalOpen(false);
      setProfileModalOpenTab('');
    });
  };

  const handleUserBlock = async () => {
    const token = await getTokenSilently();
    const blockStatus = !user.blocked;
    Axios.patch(
      `${auth0ProxyUrl}/users/${user.userId}`,
      {
        blocked: blockStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then(() => {
      const userDataCopy = [...userData];
      const currUser = userDataCopy.find(u => u.userId === user.userId);
      currUser.blocked = blockStatus;
      setUserData(userDataCopy);
      setIsBlockUserModalOpen(false);
    });
  };

  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={() => {
        setProfileModalOpenTab('');
      }}
    >
      <Typography fontFamily="openSans">
        <Grid>
          <Cell>
            <Typography color="black" size="large">
              User
            </Typography>
          </Cell>
          <Cell as={GridContentRight}>
            <Button
              color="transparent"
              onClick={() => {
                setProfileModalOpenTab('');
              }}
            >
              <Typography color="black">
                <Icon name="close" />
              </Typography>
            </Button>
          </Cell>
        </Grid>

        <Grid columns="min-content 2fr 1fr">
          <Cell>
            <Icon name="user" as={BiggerIcon} />
          </Cell>
          <Cell>
            <p>Name: {user && user.name}</p>
            <p>Email: {user && user.email}</p>
            <p>Status: {user && user.blocked ? 'Blocked' : 'Active'}</p>
          </Cell>
          <Cell>
            <p>
              <Button
                as={BlockDeleteButton}
                onClick={() => setIsBlockUserModalOpen(true)}
              >
                <Icon name="ban" />
                <BlockDeleteText>
                  {user.blocked ? 'Unblock' : 'Block'}
                </BlockDeleteText>
              </Button>
            </p>
            <p>
              <Button
                as={BlockDeleteButton}
                color="red"
                onClick={() => setIsDeleteUserModalOpen(true)}
              >
                <Icon name="trash" />
                <span style={{marginLeft: '5px'}}>Delete</span>
              </Button>
            </p>
          </Cell>
        </Grid>

        <TabsContainer>
          <Tab
            text="Roles"
            active={profileModalOpenTab === 'Roles'}
            onClick={() => setProfileModalOpenTab('Roles')}
          />
          <Tab
            text="Hierarchies"
            active={profileModalOpenTab === 'Hierarchies'}
            onClick={() => setProfileModalOpenTab('Hierarchies')}
          />
        </TabsContainer>
        {renderCurrentTab()}
      </Typography>
      {isBlockUserModalOpen && (
        <Confirm
          isOpen
          title={`Block ${user.name}`}
          content={`Are you sure you want to ${
            user.blocked ? 'unblock' : 'block'
          } this user?`}
          confirmButtonText={`${user.blocked ? 'Unblock ' : 'Block'}`}
          onConfirm={() => handleUserBlock()}
          onCancel={() => setIsBlockUserModalOpen(false)}
        />
      )}
      {isDeleteUserModalOpen && (
        <Confirm
          isOpen
          title={`DELETE ${user.name}`}
          confirmButtonText={'Delete'}
          content={'Are you sure you want to DELETE this user?'}
          onCancel={() => setIsDeleteUserModalOpen(false)}
          onConfirm={() => deleteUser()}
        />
      )}
    </StyledModal>
  );
};

UserModal.propTypes = {
  isOpen: PropTypes.bool,
  user: PropTypes.shape({
    email: PropTypes.string,
    id: PropTypes.number,
    userId: PropTypes.string,
    lastLogin: PropTypes.string,
    logins: PropTypes.number,
    name: PropTypes.string,
    roles: PropTypes.array,
    blocked: PropTypes.bool,
  }).isRequired,
  profileModalOpenTab: PropTypes.string,
  setProfileModalOpenTab: PropTypes.func,
  userData: PropTypes.array,
  setUserData: PropTypes.func,
};
