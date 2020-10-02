import {
  addRoleToUser,
  deleteUser,
  getAllRoles,
  getRolesForUser,
  removeRoleFromUser,
  updateUserBlockStatus,
} from '@ceruleandatahub/middleware-redux';
import {
  Button,
  Cell,
  DataTable,
  Grid,
  Icon,
  Select,
  Tab,
  Typography,
} from '@ceruleandatahub/react-components';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import Modal from 'styled-react-modal';

import {Confirm} from '../ConfirmUser.jsx';
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

export const UserModal = ({isOpen, setEditProfileModalIsOpen, user}) => {
  const dispatch = useDispatch();

  const {allRoles} = useSelector(({roles}) => roles);
  const {rolesForUser} = useSelector(({users}) => users);

  const [selectedRoleToAdd, setSelectedRoleToAdd] = useState();
  const [isBlockUserModalOpen, setIsBlockUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Roles');
  const [isUserBlocked, setIsUserBlocked] = useState(user.blocked);

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

  const removeRoleFromTheUser = async roleId => {
    const properties = {
      id: user.userId,
      data: {roles: [roleId]},
    };

    dispatch(removeRoleFromUser(properties));
  };

  const addRoleToTheUser = async () => {
    const selectedRole = allRoles.find(role => role.name === selectedRoleToAdd);
    if (!selectedRole) return;

    const properties = {
      id: user.userId,
      roles: [selectedRole],
    };

    dispatch(addRoleToUser(properties));
  };

  // eslint-disable-next-line react/prop-types
  const ModalDataTableToolCell = ({id}) => (
    <Button onClick={() => removeRoleFromTheUser(id)}>
      <Icon name="trash" />
    </Button>
  );

  useEffect(() => {
    dispatch(getRolesForUser(user.userId));
    dispatch(getAllRoles());
  }, []);

  const getAvailableRoles = () => {
    const defaultOption = {id: 'placeholder', value: 'Select role'};
    return (
      allRoles &&
      rolesForUser && [
        defaultOption,
        ...allRoles
          .filter(role => !rolesForUser.some(r => r.id === role.id))
          .map(role => ({...role, value: role.name})),
      ]
    );
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
      <DataTable columns={manageUsersModalDataColumns} data={rolesForUser} />
      <TextRightDiv>
        <a href="/manage">Manage Roles</a>
      </TextRightDiv>
    </>
  );

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'Roles':
        return renderRolesTabContent(getAvailableRoles());

      case 'Hierarchies':
        return <HierarchyTab user={user} />;

      default:
        return <div />;
    }
  };

  const handleDeleteUser = async () => {
    const handleDelete = async () => dispatch(deleteUser(user.userId));

    try {
      await handleDelete();
      setEditProfileModalIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserBlock = async () => {
    const blockStatus = !isUserBlocked;

    const properties = {
      id: user.userId,
      blockStatus,
    };

    const handleBlock = async () => dispatch(updateUserBlockStatus(properties));

    try {
      await handleBlock();
      setIsUserBlocked(!isUserBlocked);
      setIsBlockUserModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={() => {
        setEditProfileModalIsOpen(false);
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
                setEditProfileModalIsOpen(false);
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
            <p>Status: {user && isUserBlocked ? 'Blocked' : 'Active'}</p>
          </Cell>
          <Cell>
            <p>
              <Button
                as={BlockDeleteButton}
                onClick={() => setIsBlockUserModalOpen(true)}
              >
                <Icon name="ban" />
                <BlockDeleteText>
                  {isUserBlocked ? 'Unblock' : 'Block'}
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
            active={activeTab === 'Roles'}
            onClick={() => setActiveTab('Roles')}
          />
          <Tab
            text="Hierarchies"
            active={activeTab === 'Hierarchies'}
            onClick={() => setActiveTab('Hierarchies')}
          />
        </TabsContainer>
        {renderCurrentTab()}
      </Typography>
      {isBlockUserModalOpen && (
        <Confirm
          isOpen
          title={`Block ${user.name}`}
          content={`Are you sure you want to ${
            isUserBlocked ? 'unblock' : 'block'
          } this user?`}
          confirmButtonText={`${isUserBlocked ? 'Unblock ' : 'Block'}`}
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
          onConfirm={() => handleDeleteUser()}
        />
      )}
    </StyledModal>
  );
};

UserModal.propTypes = {
  isOpen: PropTypes.bool,
  user: PropTypes.shape({
    email: PropTypes.string,
    userId: PropTypes.string,
    lastLogin: PropTypes.string,
    logins: PropTypes.number,
    name: PropTypes.string,
    roles: PropTypes.array,
    blocked: PropTypes.bool,
  }).isRequired,
  editProfileModalIsOpen: PropTypes.bool,
  setEditProfileModalIsOpen: PropTypes.func,
};
