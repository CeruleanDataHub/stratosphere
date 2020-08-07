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

const GridContentRight = styled.div`
  grid-column-end: none;
`;

const ModalHeader = ({closeModal}) => (
  <Grid>
    <Cell>
      <Typography color="black" size="large">
        Role
      </Typography>
    </Cell>
    <Cell as={GridContentRight}>
      <Button color="transparent" onClick={() => closeModal()}>
        <Typography color="black">
          <Icon name="close" />
        </Typography>
      </Button>
    </Cell>
  </Grid>
);

ModalHeader.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default ModalHeader;
