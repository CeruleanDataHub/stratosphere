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

const IconMarginRight = styled.div`
  margin-right: 0.5rem;
`;

const GridContentRight = styled.div`
  grid-column-end: none;
`;

const ButtonWithIcon = styled.button`
  padding: 0.6rem;
  span {
    margin-right: 0.4rem;
  }
`;

const ManagementHeader = ({backButtonText, createItemButtonText}) => (
  <div>
    <Grid>
      <Cell>
        <Typography color="black" size="large">
          <Icon name="arrow-left-circle" as={IconMarginRight} />
          {backButtonText}
        </Typography>
      </Cell>

      <Cell as={GridContentRight}>
        <Button as={ButtonWithIcon}>
          <Icon name="plus" />
          {createItemButtonText}
        </Button>
      </Cell>
    </Grid>
  </div>
);

ManagementHeader.propTypes = {
  backButtonText: PropTypes.string.isRequired,
  createItemButtonText: PropTypes.string.isRequired,
};

export default ManagementHeader;
