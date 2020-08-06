import {
  Button,
  Cell,
  DataTable,
  Dropdown,
  Grid,
  Icon,
  Select,
  Tab,
  Typography,
} from '@ceruleandatahub/react-components';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import styled from 'styled-components';
import Modal from 'styled-react-modal';

const StyledModal = Modal.styled`
    display: flex;
    background-color: white;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 0 18px -3px rgba(27, 27, 27, 0.8);
    width: 75%;
    border: 1px solid red;
`;

const ModalDataTableToolCell = () => (
  <Button>
    <Icon name="trash" />
  </Button>
);

// eslint-disable-next-line react/prop-types
const cell = ({id}) => <ModalDataTableToolCell id={id} />;

const GridContentRight = styled.div`
  grid-column-end: none;
`;
const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid black;
`;

const BiggerIcon = styled.span`
  margin: 20px;
  font-size: 50px;
`;

const manageUsersModalData = {
  data: [
    {id: 1, name: 'Student'},
    {id: 2, name: 'Reports Manager'},
    {id: 3, name: 'Cerulean admin'},
  ],
  columns: [
    {id: 1, name: 'Name', selector: 'name'},
    {
      id: 2,
      name: '',
      selector: 'actions',
      cell,
    },
  ],
};

const manageGroupsModalData = {
  data: [
    {id: 1, name: 'Hacklab'},
    {id: 2, name: 'Team Cerulean'},
    {id: 3, name: 'Houston Inc.'},
  ],
  columns: [
    {id: 1, name: 'Name', selector: 'name'},
    {
      id: 2,
      name: '',
      selector: 'actions',
      cell,
    },
  ],
};

const manageHierarchiesModalData = {
  data: [
    {id: 1, name: 'Houston Inc.'},
    {
      id: 2,
      name:
        'Haaga-Helia / Faculty of Business Administration / IoT Course Spring 2021',
    },
    {id: 3, name: 'University of Delft'},
  ],
  columns: [
    {id: 1, name: 'Name', selector: 'name'},
    {
      id: 2,
      name: '',
      selector: 'actions',
      cell,
    },
  ],
};

const hierarchiesSelectOptions = [
  {
    group: 'University of Trento',
    children: [
      {id: 1, value: 'Faculty of Business Administration'},
      {id: 2, value: 'Faculty of Artificial Intelligence'},
      {id: 3, value: 'Faculty of IoT'},
    ],
  },
  {
    group: 'University of Helsinki',
    children: [
      {id: 4, value: 'Faculty of B.A'},
      {id: 5, value: 'Faculty of AI'},
      {id: 6, value: 'IoT faculty'},
    ],
  },
];

export const UserModal = ({
  isOpen,
  profileModalOpenTab,
  setProfileModalOpenTab,
}) => {
  const [modalDropdownOpen, setModalDropdownOpen] = useState(false);
  const [hierarchiesSelectedOption, setHierarchiesSelectedOption] = useState(
    hierarchiesSelectOptions[0],
  );

  const renderRolesTabContent = () => (
    <>
      <Grid columns="6fr 1fr">
        <Cell>
          <Dropdown
            label="Roles"
            onClick={() => setModalDropdownOpen(!modalDropdownOpen)}
            isOpen={modalDropdownOpen}
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
          <Button>Add role</Button>
        </Cell>
      </Grid>

      <DataTable
        columns={manageUsersModalData.columns}
        data={manageUsersModalData.data}
      />

      <div>
        <a href="/manage">Manage Roles</a>
      </div>
    </>
  );

  const renderGroupsTabContent = () => (
    <>
      <Grid columns="6fr 1fr">
        <Cell>
          <Dropdown
            label="Groups"
            onClick={() => setModalDropdownOpen(!modalDropdownOpen)}
            isOpen={modalDropdownOpen}
          >
            <ul>
              <li>Team Konecranes</li>
              <li>Team Igniter</li>
              <li>Team Elisa</li>
              <li>Team Telia</li>
            </ul>
          </Dropdown>
        </Cell>
        <Cell>
          <Button>Add role</Button>
        </Cell>
      </Grid>

      <DataTable
        columns={manageGroupsModalData.columns}
        data={manageGroupsModalData.data}
      />

      <div>
        <a href="/manage">Manage groups</a>
      </div>
    </>
  );

  const renderHierarchiesTabContent = () => (
    <>
      <Grid columns="6fr 1fr">
        <Cell>
          <Select
            items={hierarchiesSelectOptions}
            selectedOption={hierarchiesSelectedOption}
            onChange={e => setHierarchiesSelectedOption(e.target.value)}
          />
        </Cell>
        <Cell>
          <Button>Add role</Button>
        </Cell>
      </Grid>

      <DataTable
        columns={manageHierarchiesModalData.columns}
        data={manageHierarchiesModalData.data}
      />

      <div>
        <a href="/manage">Manage hierarchies</a>
      </div>
    </>
  );

  const renderCurrentTab = () => {
    switch (profileModalOpenTab) {
      case 'Roles':
        return renderRolesTabContent();
      case 'Groups':
        return renderGroupsTabContent();
      case 'Hierarchies':
        return renderHierarchiesTabContent();
      default:
        return <div></div>;
    }
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

        <Grid columns="min-content 1fr">
          <Cell>
            <Icon name="user" as={BiggerIcon} />
          </Cell>
          <Cell>
            <p>Name: User Name</p>
            <p>Email: User@example.com</p>
          </Cell>
        </Grid>

        <TabsContainer>
          <Tab
            text="Roles"
            active={profileModalOpenTab === 'Roles'}
            onClick={() => setProfileModalOpenTab('Roles')}
          />
          <Tab
            text="Groups"
            active={profileModalOpenTab === 'Groups'}
            onClick={() => setProfileModalOpenTab('Groups')}
          />
          <Tab
            text="Hierarchies"
            active={profileModalOpenTab === 'Hierarchies'}
            onClick={() => setProfileModalOpenTab('Hierarchies')}
          />
        </TabsContainer>

        {renderCurrentTab()}
      </Typography>
    </StyledModal>
  );
};

UserModal.propTypes = {
  isOpen: PropTypes.bool,
  profileModalOpenTab: PropTypes.string,
  setProfileModalOpenTab: PropTypes.func,
};
