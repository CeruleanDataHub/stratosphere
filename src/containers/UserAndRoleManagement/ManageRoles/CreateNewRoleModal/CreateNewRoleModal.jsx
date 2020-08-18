import React, {useState} from 'react';
import ModalHeader from '../RoleModal/ModalHeader/ModalHeader.jsx';
import {Button, Input} from '@ceruleandatahub/react-components';

import {PropTypes} from 'prop-types';
import Modal from 'styled-react-modal';
import styled from 'styled-components';
import {useAuth0} from '../../../../auth0-spa.jsx';
import postRole from '../getRoles/postRole.js';

const NewRoleModal = Modal.styled`
    display: flex;
    background-color: white;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 0 18px -3px rgba(27, 27, 27, 0.8);
    width: 75%;
    border: 1px solid red;
    align-items: center;
`;

const NewRoleForm = styled.form`
  padding: 1em;
  width: 65%;
  display: flex;
  flex-direction: column;
`;

const NewRoleFormInput = styled.input`
  margin: 0 0 1em 0;
`;

const NewRoleFormButton = styled.button`
  height: 32px;
  width: 50%;
  align-self: center;
`;

const ErrorMessage = styled.div`
  align-self: center;
  color: red;
  padding: 1em 0 0 0;
`;

const CreateNewRoleModal = ({
  isOpen,
  closeModal,
  newRoleName,
  newRoleDescription,
  setNewRoleName,
  setNewRoleDescription,
}) => {
  const {getTokenSilently} = useAuth0();

  const [fetchErrorMessage, setFetchErrorMessage] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();

    const postNewRole = async () => {
      const token = await getTokenSilently();

      const newRole = {
        name: newRoleName,
        description: newRoleDescription,
      };

      return await postRole(token, newRole);
    };

    const response = await postNewRole();

    response.status !== 200
      ? setFetchErrorMessage(response.data.message)
      : closeModal();
  };

  return (
    <NewRoleModal onBackgroundClick={closeModal} isOpen={isOpen}>
      <ModalHeader title="New Role" closeModal={closeModal} />

      <NewRoleForm onSubmit={event => handleSubmit(event)}>
        <Input
          as={NewRoleFormInput}
          onChange={event => setNewRoleName(event.target.value)}
          placeholder="Name"
          type="text"
          value={newRoleName}
        />

        <Input
          as={NewRoleFormInput}
          onChange={event => setNewRoleDescription(event.target.value)}
          placeholder="Description"
          type="text"
          value={newRoleDescription}
        />

        <Button as={NewRoleFormButton} type="submit">
          Create new role
        </Button>

        <ErrorMessage>{fetchErrorMessage && fetchErrorMessage}</ErrorMessage>
      </NewRoleForm>
    </NewRoleModal>
  );
};

CreateNewRoleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  newRoleName: PropTypes.string.isRequired,
  newRoleDescription: PropTypes.string.isRequired,
  setNewRoleName: PropTypes.func.isRequired,
  setNewRoleDescription: PropTypes.func.isRequired,
};

export default CreateNewRoleModal;
