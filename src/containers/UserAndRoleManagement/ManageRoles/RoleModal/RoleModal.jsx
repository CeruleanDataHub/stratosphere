import React from 'react';
import Modal from 'styled-react-modal';
import PropTypes from 'prop-types';
import ModalHeader from './ModalHeader/ModalHeader.jsx';

const StyledModal = Modal.styled`
    display: flex;
    background-color: white;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 0 18px -3px rgba(27, 27, 27, 0.8);
    width: 75%;
    border: 1px solid red;
`;

const RoleModal = ({isOpen, roleModalOpenTab, setRoleModalOpenTab}) => {
  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={() => setRoleModalOpenTab('')}
    >
      {roleModalOpenTab}
      <ModalHeader closeModal={() => setRoleModalOpenTab('')} />
    </StyledModal>
  );
};

RoleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  roleModalOpenTab: PropTypes.string.isRequired,
  setRoleModalOpenTab: PropTypes.func.isRequired,
};

export default RoleModal;
