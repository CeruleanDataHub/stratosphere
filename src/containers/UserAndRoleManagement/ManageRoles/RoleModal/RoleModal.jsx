import React from 'react';
import Modal from 'styled-react-modal';
import PropTypes from 'prop-types';
import ModalHeader from './ModalHeader/ModalHeader.jsx';
import styled from 'styled-components';
import {Tab} from '@ceruleandatahub/react-components';

const StyledModal = Modal.styled`
    display: flex;
    background-color: white;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 0 18px -3px rgba(27, 27, 27, 0.8);
    width: 75%;
    border: 1px solid red;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid black;
`;

const TabContent = styled.div`
  margin: 10px;
`;

const RoleModal = ({isOpen, roleModalOpenTab, setRoleModalOpenTab, name}) => (
  <StyledModal
    isOpen={isOpen}
    onBackgroundClick={() => setRoleModalOpenTab('')}
  >
    <ModalHeader closeModal={() => setRoleModalOpenTab('')} name={name} />

    <TabsContainer>
      <Tab
        text="Permissions"
        active={roleModalOpenTab === 'Permissions'}
        onClick={() => setRoleModalOpenTab('Permissions')}
      />

      <Tab
        text="Settings"
        active={roleModalOpenTab === 'Settings'}
        onClick={() => setRoleModalOpenTab('Settings')}
      />
    </TabsContainer>

    <TabContent>
      {roleModalOpenTab === 'Permissions' ? (
        <div>Permissions</div>
      ) : (
        <div>Settings</div>
      )}
    </TabContent>
  </StyledModal>
);

RoleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  roleModalOpenTab: PropTypes.string.isRequired,
  setRoleModalOpenTab: PropTypes.func.isRequired,
};

export default RoleModal;
