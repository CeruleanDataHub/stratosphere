import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import Modal from 'styled-react-modal';

import {Button, Typography} from '@ceruleandatahub/react-components';

const StyledModal = Modal.styled`
  display: flex;
  background-color: white;
  flex-direction: column;
  padding: 1rem;
  box-shadow: 0 0 18px -3px rgba(27, 27, 27, 0.8);
  width: 40%;
`;

const TextAlignRight = styled.div`
  text-align: right;

  button {
    margin: 0.2rem;
  }
`;

const ConfirmButton = styled.button`
  background: blue;
  color: white;
  font-weight: bold;
`;

const CancelButton = styled.button`
  color: blue;
  text-decoration: underline;
`;

export const Confirm = ({
  title,
  content,
  isOpen,
  onConfirm,
  onCancel,
  confirmButtonText,
}) => (
  <StyledModal isOpen={isOpen} onBackgroundClick={onCancel}>
    <Typography fontFamily="openSans">
      <div>{title}</div>
      <div>{content}</div>
      <TextAlignRight>
        <Button color="transparent" onClick={onCancel} as={CancelButton}>
          Cancel
        </Button>
        <Button onClick={onConfirm} as={ConfirmButton}>
          {confirmButtonText || 'Confirm'}
        </Button>
      </TextAlignRight>
    </Typography>
  </StyledModal>
);

Confirm.propTypes = {
  /** Confirm modal title */
  title: PropTypes.string,
  /** Confirm modal content */
  content: PropTypes.node,
  /** Is confirm open or not */
  isOpen: PropTypes.bool,
  /** Function for confirmation event */
  onConfirm: PropTypes.func,
  /** Function for cancellation event */
  onCancel: PropTypes.func,
  /** Confirm button text */
  confirmButtonText: PropTypes.string,
};

Confirm.defaultProps = {
  title: '',
  content: '',
  isOpen: false,
  onConfirm: () => null,
  onCancel: () => null,
};
