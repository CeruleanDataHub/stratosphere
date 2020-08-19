import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Modal from 'styled-react-modal';

import ModalHeader from './ModalHeader/ModalHeader.jsx';
import ModalTabs from './ModalTabs/ModalTabs.jsx';
import PermissionsView from './Views/PermissionsView/PermissionsView.jsx';
import SettingsView from './Views/SettingsView.jsx';
import getAllPermissions from '../getPermissions/getPermissions';
import {useAuth0} from '../../../../auth0-spa.jsx';

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
  setEditModalIsOpen,
  activeRole,
  permissionsForRole,
}) => {
  const {getTokenSilently} = useAuth0();

  const [allPermissions, setAllPermissions] = useState([]);
  const [activeTab, setActiveTab] = useState('Permissions');

  useEffect(() => {
    const getPermissions = async () => {
      const token = await getTokenSilently();

      const response = await getAllPermissions(token);

      const permissions = response.data.scopes.map(
        permission => permission.value,
      );

      setAllPermissions(permissions);
    };

    getPermissions();
  }, []);

  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={() => setEditModalIsOpen(false)}
    >
      <ModalHeader
        closeModal={() => setEditModalIsOpen(false)}
        title="Role"
        name={activeRole.name}
        icon="user"
      />

      <ModalTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={roleModalTabsData}
      />

      <TabContent>
        {isOpen && activeTab === 'Permissions' ? (
          <PermissionsView
            activeRoleID={activeRole.id}
            permissionsForRole={permissionsForRole}
            allPermissions={allPermissions}
          />
        ) : (
          <SettingsView />
        )}
      </TabContent>
    </StyledModal>
  );
};

RoleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  activeRole: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  setEditModalIsOpen: PropTypes.func.isRequired,
  permissionsForRole: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default RoleModal;
