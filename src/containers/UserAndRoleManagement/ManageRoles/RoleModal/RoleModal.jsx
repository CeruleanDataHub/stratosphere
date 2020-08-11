import React from 'react';
import Modal from 'styled-react-modal';
import PropTypes from 'prop-types';
import ModalHeader from './ModalHeader/ModalHeader.jsx';
import styled from 'styled-components';
import ModalTabs from './ModalTabs/ModalTabs.jsx';

const StyledModal = Modal.styled`
    display: flex;
    background-color: white;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 0 18px -3px rgba(27, 27, 27, 0.8);
    width: 75%;
    border: 1px solid red;
`;

const TabContent = styled.div`
  margin: 10px;
`;

const roleModalTabsData = ['Permissions', 'Settings'];

const RoleModal = ({
  isOpen,
  roleModalOpenTab,
  setRoleModalOpenTab,
  activeRole,
}) => (
  <StyledModal
    isOpen={isOpen}
    onBackgroundClick={() => setRoleModalOpenTab('')}
  >
    <ModalHeader
      closeModal={() => setRoleModalOpenTab('')}
      name={activeRole.name}
    />

    <ModalTabs
      roleModalOpenTab={roleModalOpenTab}
      setRoleModalOpenTab={setRoleModalOpenTab}
      tabs={roleModalTabsData}
    />

    <TabContent>
      {roleModalOpenTab === 'Permissions' ? (
        <ul>
          {activeRole.permissionsForModal.map(({permission_name}, key) => (
            <li key={key}>{permission_name}</li>
          ))}
        </ul>
      ) : (
        <div>Settings</div>
      )}
    </TabContent>
  </StyledModal>
);

RoleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  activeRole: PropTypes.shape({
    id: PropTypes.string,
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
  roleModalOpenTab: PropTypes.string.isRequired,
  setRoleModalOpenTab: PropTypes.func.isRequired,
};

export default RoleModal;
