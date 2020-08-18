import React, {useRef, useState} from 'react';
import {
  Button,
  Icon,
  Popover,
  useOutsideClick,
} from '@ceruleandatahub/react-components';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Action from './Action.jsx';

const BorderlessButton = styled.span`
  border: 0px;
  transform: rotate(90deg);
`;

const ActionCellContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const ActionsCell = ({
  setModalOpenTab,
  actionsData,
  setActive,
  active,
  fetchForEntity,
}) => {
  const moreRef = useRef(null);
  const popoverRef = useRef(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleOnClick = () => {
    setPopoverOpen(!popoverOpen);
    setActive(active);
    fetchForEntity(active);
  };

  useOutsideClick(popoverRef, () => setPopoverOpen(false));

  return (
    <ActionCellContainer>
      <Button onClick={handleOnClick} ref={moreRef} as={BorderlessButton}>
        <Icon name="more-alt" />
      </Button>

      <Popover
        isOpen={popoverOpen}
        containerRef={moreRef}
        popoverRef={popoverRef}
      >
        {actionsData.map(({icon, modalToOpen, text}, key) => (
          <Action
            key={key}
            onClick={() => setModalOpenTab(modalToOpen)}
            icon={icon}
            text={text}
          />
        ))}
      </Popover>
    </ActionCellContainer>
  );
};

ActionsCell.propTypes = {
  setModalOpenTab: PropTypes.func.isRequired,
  setActive: PropTypes.func.isRequired,
  active: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  actionsData: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      modalToOpen: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
  ),
  fetchForEntity: PropTypes.func,
};

const Borderless = styled.span`
  border: 0px;
`;

export const UserEditCell = ({setProfileModalOpenTab, setActiveUser, user}) => {
  return (
    <>
      <Button
        onClick={() => {
          setActiveUser(user);
          setProfileModalOpenTab('Roles');
        }}
        as={Borderless}
      >
        <Icon name="pencil" />
      </Button>
    </>
  );
};

UserEditCell.propTypes = {
  setProfileModalOpenTab: PropTypes.func.isRequired,
  setActiveUser: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
    userId: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    permissions: PropTypes.number,
    permissionsForModal: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string,
        permission_name: PropTypes.string,
        resource_server_identifier: PropTypes.string,
        resource_server_name: PropTypes.string,
      }),
    ),
    users: PropTypes.number,
  }).isRequired,
};

export default ActionsCell;
