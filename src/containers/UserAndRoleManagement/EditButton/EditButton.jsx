import React from 'react';
import {Button, Icon} from '@ceruleandatahub/react-components';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const BorderlessButton = styled.span`
  border: 0px;
`;

const EditButton = ({
  setActive,
  active,
  setEditModalIsOpen,
  fetchForEntity,
}) => {
  const handleOnClick = async () => {
    fetchForEntity && (await fetchForEntity(active));

    setActive(active);

    setEditModalIsOpen(true);
  };

  return (
    <Button onClick={handleOnClick} as={BorderlessButton}>
      <Icon name="pencil" />
    </Button>
  );
};

EditButton.propTypes = {
  setActive: PropTypes.func.isRequired,
  active: PropTypes.shape({}).isRequired,
  setEditModalIsOpen: PropTypes.func.isRequired,
  fetchForEntity: PropTypes.func,
};

export default EditButton;
