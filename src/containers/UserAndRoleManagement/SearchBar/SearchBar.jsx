import React from 'react';
import {
  Button,
  Cell,
  Grid,
  Icon,
  Input,
} from '@ceruleandatahub/react-components';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ButtonWithIcon = styled.button`
  padding: 0.6rem;
  span {
    margin-right: 0.4rem;
  }
`;

const Form = styled.form`
  margin: ${({margin}) => `${margin}px`} 0;
`;

const SearchButton = styled(ButtonWithIcon)`
  width: 100%;
`;
const submitHandler = event => {
  event.preventDefault();
};
const SearchBar = ({value, onChange, showSearchButton, margin}) => {
  return (
    <Form onSubmit={event => submitHandler(event)} margin={margin}>
      <Grid columns={showSearchButton ? '4fr 1fr' : '5fr'}>
        <Cell>
          <Input
            type="search"
            placeholder="Search"
            value={value}
            onChange={onChange}
          />
        </Cell>

        {showSearchButton && (
          <Cell>
            <Button type="submit" as={SearchButton}>
              <Icon name="search" />
              Search
            </Button>
          </Cell>
        )}
      </Grid>
    </Form>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  showSearchButton: PropTypes.bool,
  margin: PropTypes.number,
};

SearchBar.defaultProps = {
  showSearchButton: true,
  margin: 50,
};

export default SearchBar;
