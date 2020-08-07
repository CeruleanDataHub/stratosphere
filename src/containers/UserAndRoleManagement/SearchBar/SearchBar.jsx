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
  margin: 50px 0;
`;

const SearchButton = styled(ButtonWithIcon)`
  width: 100%;
`;

const submitHandler = event => {
  event.preventDefault();
};

const SearchBar = ({value, onChange}) => (
  <Form onSubmit={event => submitHandler(event)}>
    <Grid columns="4fr 1fr">
      <Cell>
        <Input
          type="search"
          placeholder="Search"
          value={value}
          onChange={onChange}
        />
      </Cell>

      <Cell>
        <Button type="submit" as={SearchButton}>
          <Icon name="search" />
          Search
        </Button>
      </Cell>
    </Grid>
  </Form>
);

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SearchBar;
