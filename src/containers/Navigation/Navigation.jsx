import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
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
  color: white;
`;

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(true);
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

  let menuIconClasses = ['lnr'];
  if (menuOpen) {
    menuIconClasses.push('lnr-cross');
  } else {
    menuIconClasses.push('lnr-menu');
  }

  return (
    <NavBar id="left-navigation" menuOpen={menuOpen}>
      <MenuOpen onClick={toggleMenu}>
        <MenuIcon className={menuIconClasses}></MenuIcon>
      </MenuOpen>
      <MenuItems>
        {isAuthenticated ? (
          <>
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
            <MenuItem>
              <Link to="/user-management">
                <Icon className="lnr lnr-users"></Icon>
                <MenuItemText menuOpen={menuOpen}>User Management</MenuItemText>
              </Link>
            </MenuItem>
            <MenuItem>
              <Link to="/resource-management">
                <Icon className="lnr lnr-layers"></Icon>
                <MenuItemText menuOpen={menuOpen}>
                  Resource Management
                </MenuItemText>
              </Link>
            </MenuItem>
            <MenuItem>
              <Link to="/hierarchy-management">
                <Icon className="lnr lnr-layers"></Icon>
                <MenuItemText menuOpen={menuOpen}>
                  Hierarchy Management
                </MenuItemText>
              </Link>
            </MenuItem>
            <MenuItem>
              <div className="user-btn" onClick={handleLogoutClick}>
                <Icon className="lnr lnr-exit"></Icon>
                <MenuItemText menuOpen={menuOpen}>Logout</MenuItemText>
              </div>
            </MenuItem>
          </>
        ) : (
          <MenuItem>
            <div className="user-btn" onClick={handleLoginClick}>
              <Icon className="lnr lnr-enter"></Icon>
              <MenuItemText menuOpen={menuOpen}>Login</MenuItemText>
            </div>
          </MenuItem>
        )}
      </MenuItems>
    </NavBar>
  );
};

export default Navigation;
