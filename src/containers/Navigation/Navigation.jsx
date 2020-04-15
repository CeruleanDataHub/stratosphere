import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

const NavBar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  max-width: 18em;
  transition: width linear 280ms;
  width: ${props => (props.menuOpen ? 20 : 4.5)}em;
  background-color: rgba(0, 0, 0, 0.75);
  color: #ffffff;
`;

const MenuOpen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4em;
  height: 3.5em;
  cursor: pointer;
`;
const MenuIcon = styled.span`
  font-size: 2em;
  margin: 0.5em;
`;

const Icon = styled.span`
  font-size: 1.5em;
  margin-right: 1.75rem;
  float: left;
`;

const MenuItems = styled.ul`
  margin: 1em 0 0 0.25em;
  padding: 0;
  list-style-type: none;
`;

const MenuItem = styled.li`
  display: block;
  padding: 1em;
  line-height: 1.5em;
  height: 1.5em;
`;

const MenuItemText = styled.span`
  display: ${props => (props.menuOpen ? 'block' : 'none')};
`;

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: true,
    };

    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    console.log('toggling state');
    this.setState({menuOpen: !this.state.menuOpen});
  }

  render() {
    const {menuOpen} = this.state;
    let menuIconClasses = ['lnr'];
    if (menuOpen) {
      menuIconClasses.push('lnr-cross');
    } else {
      menuIconClasses.push('lnr-menu');
    }

    return (
      <NavBar id="left-navigation" menuOpen={menuOpen}>
        <MenuOpen onClick={this.toggleMenu}>
          <MenuIcon className={menuIconClasses}></MenuIcon>
        </MenuOpen>
        <MenuItems>
          <MenuItem>
            <Link to="/">
              <Icon className="lnr lnr-home"></Icon>
              <MenuItemText menuOpen={menuOpen}>Home</MenuItemText>
            </Link>
          </MenuItem>
          <MenuItem>
            <Link to="/devices">
              <Icon className="lnr lnr-rocket"></Icon>
              <MenuItemText menuOpen={menuOpen}>Devices</MenuItemText>
            </Link>
          </MenuItem>
        </MenuItems>
      </NavBar>
    );
  }
}
