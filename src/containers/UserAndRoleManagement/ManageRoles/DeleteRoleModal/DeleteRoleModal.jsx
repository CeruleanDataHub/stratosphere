import {deleteRole} from '@ceruleandatahub/middleware-redux';
import {Button} from '@ceruleandatahub/react-components';
import PropTypes from 'prop-types';
import React from 'react';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import Modal from 'styled-react-modal';

const DeleteModal = Modal.styled`
  display: flex;
  background-color: white;
  flex-direction: column;
  padding: 1rem;
  box-shadow: 0 0 18px -3px rgba(27, 27, 27, 0.8);
  width: 45%;
  border: 1px solid red;
  align-items: center;
`;

const ConfirmText = styled.p`
  margin-bottom: 1em;
`;

const ButtonWrapper = styled.div`
  display: flex;
`;

const DeleteButton = styled.button`
  background: red;
  color: white;
  margin-right: 2em;
`;

const DeleteRoleModal = ({
  isOpen,
  closeModal,
  handleCancel,
  confirmText,
  activeRoleID,
}) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    const handleDeleteRole = async () => {
      return dispatch(deleteRole(activeRoleID));
    };

    const response = await handleDeleteRole();

    !response.payload.error && closeModal();
  };

  return (
    <DeleteModal isOpen={isOpen} onBackgroundClick={closeModal}>
      <ConfirmText>{confirmText}</ConfirmText>
      <ButtonWrapper>
        <Button onClick={handleDelete} as={DeleteButton}>
          Delete role
        </Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </ButtonWrapper>
    </DeleteModal>
  );
};

DeleteRoleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  confirmText: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
    .isRequired,
  activeRoleID: PropTypes.string.isRequired,
};

export default DeleteRoleModal;
