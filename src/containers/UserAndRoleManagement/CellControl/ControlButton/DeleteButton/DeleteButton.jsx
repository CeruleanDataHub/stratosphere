import PropTypes from 'prop-types';
import React from 'react';

import ControlButton from '../ControlButton.jsx';

const DeleteButton = ({setActive, active, setDeleteConfirmIsOpen}) => {
  const handleOnClick = () => {
    setActive(active);

    setDeleteConfirmIsOpen(true);
  };

  return <ControlButton onClick={handleOnClick} color="red" icon="trash" />;
};

DeleteButton.propTypes = {
  setActive: PropTypes.func.isRequired,
  active: PropTypes.shape({}).isRequired,
  setDeleteConfirmIsOpen: PropTypes.func.isRequired,
};

export default DeleteButton;
