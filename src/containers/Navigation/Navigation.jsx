import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {Icon} from '@ceruleandatahub/react-components';

import {useAuth0} from '../../auth0-spa.jsx';
import './Navigation.css';

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
  z-index: 1;
`;

const MenuOpen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4em;
  height: 3.5em;
  cursor: pointer;
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
  color: white;
`;

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const {logout, isAuthenticated, loginWithRedirect} = useAuth0();

  const toggleMenu = () => {
    console.log('toggling state');
    setMenuOpen(!menuOpen);
  };

  const handleLogoutClick = () => {
    logout({returnTo: `${window.location.origin}`});
  };

  const handleLoginClick = () => {
    loginWithRedirect({returnTo: window.location.origin});
  };

  return (
    <NavBar id="left-navigation" menuOpen={menuOpen}>
      <MenuOpen onClick={toggleMenu}>
        <Icon name={menuOpen ? 'close' : 'menu'}></Icon>
      </MenuOpen>
      <MenuItems>
        {isAuthenticated ? (
          <>
            <MenuItem>
              <Link to="/">
                <Icon name="home"></Icon>
                <MenuItemText menuOpen={menuOpen}>Home</MenuItemText>
              </Link>
            </MenuItem>
            <MenuItem>
              <Link to="/devices">
                <Icon name="rocket"></Icon>
                <MenuItemText menuOpen={menuOpen}>Devices</MenuItemText>
              </Link>
            </MenuItem>
            <MenuItem>
              <Link to="/user-management">
                <Icon name="users"></Icon>
                <MenuItemText menuOpen={menuOpen}>User Management</MenuItemText>
              </Link>
            </MenuItem>
            <MenuItem>
              <Link to="/resource-management">
                <Icon name="layers"></Icon>
                <MenuItemText menuOpen={menuOpen}>
                  Resource Management
                </MenuItemText>
              </Link>
            </MenuItem>
            <MenuItem>
              <Link to="/hierarchy-management">
                <Icon name="layers"></Icon>
                <MenuItemText menuOpen={menuOpen}>
                  Hierarchy Management
                </MenuItemText>
              </Link>
            </MenuItem>
            <MenuItem>
              <Link to="/reporting-dashboard">
                <Icon name="dashboard"></Icon>
                <MenuItemText menuOpen={menuOpen}>
                  Reporting Dashboard
                </MenuItemText>
              </Link>
            </MenuItem>
            <MenuItem>
              <div className="user-btn" onClick={handleLogoutClick}>
                <Icon name="exit"></Icon>
                <MenuItemText menuOpen={menuOpen}>Logout</MenuItemText>
              </div>
            </MenuItem>
          </>
        ) : (
          <MenuItem>
            <div
              className="user-btn"
              data-cy="navigation-login-button-e2e-test"
              onClick={handleLoginClick}
            >
              <Icon className="enter"></Icon>
              <MenuItemText menuOpen={menuOpen}>Login</MenuItemText>
            </div>
          </MenuItem>
        )}
      </MenuItems>
    </NavBar>
  );
};

export default Navigation;
