import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  Cell,
  DataTable,
  Grid,
  Icon,
  Input,
  Popover,
  Typography,
  useOutsideClick,
} from '@ceruleandatahub/react-components';
import styled from 'styled-components';
import PropTypes from 'prop-types';

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

const ManageRolesContainer = styled.section`
  margin: 0 8em 2em 18em;
  background-color: #ffffff;
`;

const SearchButton = styled(ButtonWithIcon)`
  width: 100%;
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

const BorderlessButton = styled.span`
  border: 0px;
  transform: rotate(90deg);
`;

const UserDataCell = ({setRoleModalOpenTab}) => {
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
        <PopoverOption onClick={() => setRoleModalOpenTab('Permissions')}>
          <Icon name="chef-hat" />
          <PopoverText>Assign Permissions</PopoverText>
        </PopoverOption>
      </Popover>
    </>
  );
};

UserDataCell.propTypes = {
  setRoleModalOpenTab: PropTypes.func.isRequired,
};

const ManageRoles = () => {
  const cell = ({setRoleModalOpenTab}) => (
    <UserDataCell setRoleModalOpenTab={setRoleModalOpenTab} />
  );
  cell.propTypes = {
    setRoleModalOpenTab: PropTypes.func.isRequired,
  };

  const defaultRoleData = {
    data: [],
    columns: [
      {id: 1, name: 'Name', selector: 'name'},
      {id: 2, name: 'Users', selector: 'users'},
      {
        id: 3,
        name: 'Permissions',
        selector: 'permissions',
      },
      {
        id: 4,
        name: '',
        selector: 'actions',
        cell,
      },
    ],
  };

  const [roleData, setRoleData] = useState(defaultRoleData);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    setRoleData(defaultRoleData);
  }, []);

  return (
    <ManageRolesContainer>
      <Grid>
        <Cell>
          <Typography color="black" size="large">
            <Icon name="arrow-left-circle" as={IconMarginRight} />
            Manage Roles
          </Typography>
        </Cell>

        <Cell as={GridContentRight}>
          <Button as={ButtonWithIcon}>
            <Icon name="plus" />
            Create Role
          </Button>
        </Cell>
      </Grid>

      <form
        onSubmit={event => {
          event.preventDefault();
        }}
        className="searchUser"
      >
        <Grid columns="4fr 1fr">
          <Cell>
            <Input
              type="search"
              placeholder="Search"
              value={filterText}
              onChange={event => setFilterText(event.target.value)}
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
        columns={roleData.columns}
        data={roleData.data.filter(
          user =>
            user.name.toLowerCase().includes(filterText.toLowerCase()) ||
            user.email.toLowerCase().includes(filterText.toLowerCase()),
        )}
      />
    </ManageRolesContainer>
  );
};

export default ManageRoles;
