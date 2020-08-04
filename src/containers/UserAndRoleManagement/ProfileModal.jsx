import React, {useState, useRef} from 'react';
import styled from 'styled-components';
import {
  Grid,
  Cell,
  Icon,
  Button,
  Typography,
  Tab,
  Dropdown,
  DataTable,
  useOutsideClick,
} from '@ceruleandatahub/react-components';

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
      // eslint-disable-next-line react/prop-types
      cell: ({id}) => <ModalDataTableToolCell id={id} />,
    },
  ],
};

export const ProfileModal = ({
  isOpen,
  profileModalOpenTab,
  setProfileModalOpenTab,
}) => {
  //   const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalDropdownOpen, setModalDropdownOpen] = useState(false);
  //   const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  //   const [menuOpen, setMenuOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  //   const containerRef = useRef(null);
  const popoverRef = useRef(null);
  useOutsideClick(popoverRef, () => setPopoverOpen(false));

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

  const renderGroupsTabContent = () => <div>groups</div>;
  const renderHierarchiesTabContent = () => <div>hierarchies</div>;

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
