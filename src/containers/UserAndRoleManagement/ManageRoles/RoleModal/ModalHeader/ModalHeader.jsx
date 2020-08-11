import React from 'react';
import {
  Button,
  Cell,
  Grid,
  Icon,
  Typography,
} from '@ceruleandatahub/react-components';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const CloseButton = styled.div`
  place-self: end;
`;

const BiggerIcon = styled.span`
  margin: 20px;
  font-size: 50px;
`;

const GridContentCenter = styled.div`
  place-self: center;
`;

const ModalHeader = ({closeModal, name}) => (
  <Grid columns="1fr 11fr">
    <Cell as={GridContentCenter}>
      <Typography color="black" size="large">
        Role
      </Typography>
    </Cell>

    <Cell as={CloseButton}>
      <Button color="transparent" onClick={() => closeModal()}>
        <Typography color="black">
          <Icon name="close" />
        </Typography>
      </Button>
    </Cell>

    <Cell as={GridContentCenter}>
      <Icon name="user" as={BiggerIcon} />
    </Cell>

    <Cell>
      <p>Name: {name}</p>
    </Cell>
  </Grid>
);

ModalHeader.propTypes = {
  closeModal: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default ModalHeader;
