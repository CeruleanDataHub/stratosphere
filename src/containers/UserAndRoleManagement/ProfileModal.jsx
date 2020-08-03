import React from 'react';
import styled from 'styled-components';
import {
  Grid,
  Cell,
  Icon,
  Button,
  Typography,
  Tab,
  Dropdown,
} from '@ceruleandatahub/react-components';
import Modal from 'styled-react-modal';

const StyledModal = Modal.styled`
  width: 50rem;
  height: 30rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
`;

const GridContentRight = styled.div`
  grid-column-end: none;
`;
const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid black;
`;

export const ProfileModal = ({isOpen = true}) => {
  return (
    <StyledModal
      isOpen
      onBackgroundClick={() => {
        // eslint-disable-next-line no-console
        console.log('click on background');
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
                // eslint-disable-next-line no-console
                console.log('close modal');
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
            <div>
              <Icon name="user" />
            </div>
          </Cell>
          <Cell>
            <p>Name: User Name</p>
            <p>Email: User@example.com</p>
          </Cell>
        </Grid>

        <TabsContainer>
          <Tab text="Roles" />
          <Tab text="Groups" active />
          <Tab text="Hierarchies" />
        </TabsContainer>

        <Grid columns="6fr 1fr">
          <Cell>
            <Dropdown
              label="Groups"
              onClick={() => setModalDropdownOpen(!modalDropdownOpen)}
              isOpen={true}
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
            <Button>Add to Group</Button>
          </Cell>
        </Grid>
      </Typography>
    </StyledModal>
  );
};
