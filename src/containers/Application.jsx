import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import denim_bg from '../assets/images/DenimFabric.png';

const Main = styled.article`
  display: grid;
  min-height: 100vh;
  background-image: url(${props => props.image});
  background-repeat: no-repeat;
  background-color: #ffffff;
  background-attachment: fixed;
  background-position: left -15em;
  grid-template-rows: 20% auto;
`;

class Application extends React.Component {
  render() {
    return (
      <Main id="app" image={denim_bg}>
        {this.props.children}
      </Main>
    );
  }
}

Application.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Application;
