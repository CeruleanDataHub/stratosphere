import PropTypes from 'prop-types';
import React from 'react';

import ControlButton from '../ControlButton.jsx';

const EditButton = ({setActive, active, setEditModalIsOpen}) => {
  const handleOnClick = () => {
    setActive(active);

    setEditModalIsOpen(true);
  };

  return <ControlButton onClick={handleOnClick} icon="pencil" />;
};

EditButton.propTypes = {
  setActive: PropTypes.func.isRequired,
  active: PropTypes.shape({}).isRequired,
  setEditModalIsOpen: PropTypes.func.isRequired,
};

export default EditButton;
