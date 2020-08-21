import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const CellControlWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
`;

const CellControl = ({children}) => (
  <CellControlWrapper>{children}</CellControlWrapper>
);

CellControl.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CellControl;
