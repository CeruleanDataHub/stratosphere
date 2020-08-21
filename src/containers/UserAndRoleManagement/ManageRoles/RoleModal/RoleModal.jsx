import {
  getAllPermissions,
  getPermissionsForRole,
} from '@ceruleandatahub/middleware-redux';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import Modal from 'styled-react-modal';

import env from '../../../../config.js';
import ModalHeader from './ModalHeader/ModalHeader.jsx';
import ModalTabs from './ModalTabs/ModalTabs.jsx';
import PermissionsView from './Views/PermissionsView/PermissionsView.jsx';
import SettingsView from './Views/SettingsView.jsx';

const {AUTH0_RESOURCE_SERVER_ID} = env();

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

const RoleModal = ({isOpen, setEditModalIsOpen, activeRole}) => {
  const dispatch = useDispatch();

  const permissionsForRole = useSelector(
    ({roles: {permissionsForActiveRole}}) => permissionsForActiveRole,
  );

  const allPermissions = useSelector(({permissions: {all}}) => all);

  const [activeTab, setActiveTab] = useState('Permissions');

  useEffect(() => {
    dispatch(getAllPermissions(AUTH0_RESOURCE_SERVER_ID));

    dispatch(getPermissionsForRole(activeRole.id));
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

      {isOpen && permissionsForRole && allPermissions && (
        <TabContent>
          {activeTab === 'Permissions' ? (
            <PermissionsView
              activeRoleID={activeRole.id}
              permissionsForRole={permissionsForRole}
              allPermissions={allPermissions.map(one => one.value)}
            />
          ) : (
            <SettingsView />
          )}
        </TabContent>
      )}
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
