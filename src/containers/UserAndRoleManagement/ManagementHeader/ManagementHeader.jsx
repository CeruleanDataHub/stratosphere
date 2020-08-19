import React from 'react';
import {Link} from 'react-router-dom';
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
  cursor: pointer;
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

const ManagementHeader = ({
  backButtonText,
  createItemButtonText,
  buttonAction,
}) => (
  <div>
    <Grid>
      <Cell>
        <Typography size="large" color="black">
          <Link to="/users-and-roles" style={{color: 'black'}}>
            <Icon name="arrow-left-circle" as={IconMarginRight} />
          </Link>
          {backButtonText}
        </Typography>
      </Cell>

      <Cell as={GridContentRight}>
        <Button as={ButtonWithIcon} onClick={buttonAction}>
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
  buttonAction: PropTypes.func.isRequired,
};

export default ManagementHeader;
