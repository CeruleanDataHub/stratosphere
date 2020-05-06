import React from 'react';
import styled from 'styled-components';
import {useEffect, useState} from 'react';
import Axios from 'axios';
import {useRouteMatch, Link} from 'react-router-dom';
import {Card} from '@denim/react-components';

import './UserManagement.css';

import env from '../../config';
const UserManagementContainer = styled.section`
  margin-left: 18em;
  background-color: #ffffff;
`;

const envVar = env();
const baseApiUrl = envVar.BASE_API_URL;

const UserManagement = () => {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);

  const [inputEmail, setInputEmail] = useState('');
  const [inputRoles, setInputRoles] = useState('');
  let {url} = useRouteMatch();

  useEffect(() => {
    getRolesAndPopulateList();
  }, []);

  const getRolesAndPopulateList = () => {
    Axios.get(`${baseApiUrl}/user-management/roles`)
      .then(async res => {
        if (res.data.status === 404) {
          console.log('Error fetching roles');
        } else {
          const roles = res.data;
          setRoles(roles);
          const users = await getUsers();
          setUsersWithRoles(users, roles);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const setUsersWithRoles = (users, roles) => {
    if (!roles) return;
    const responsePromises = roles.map(role => {
      return Axios.get(
        `${baseApiUrl}/user-management/roles/${role.id}/users`,
      ).then(resp => {
        if (resp.data.status === 404) {
          console.log('Error fetching users');
        } else {
          users = setRoleForUser(users, role, resp.data);
        }
      });
    });
    Promise.all(responsePromises).then(() => {
      setUsers(users);
      setInputEmail('');
      setInputRoles('placeholder');
    });
  };

  const getUsers = () => {
    return Axios.get(`${baseApiUrl}/user-management/users`)
      .then(res => {
        if (res.data.status === 404) {
          console.log('Error fetching users');
        } else {
          const users = res.data.map(user => {
            user.roles = [];
            return user;
          });
          return users;
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const setRoleForUser = (allUsers, role, roleBasedUsers) => {
    return allUsers.map(user => {
      if (roleBasedUsers.some(roleUser => roleUser.user_id === user.user_id)) {
        user.roles.push(role);
        return user;
      } else {
        return user;
      }
    });
  };

  const onInputChange = e => {
    if (e.target.name === 'email') {
      setInputEmail(e.target.value);
    } else {
      setInputRoles(e.target.value);
    }
    e.preventDefault();
  };

  const handleSubmit = e => {
    const randomPw = 'abcdef' + Math.floor(Math.random() * 10000).toString();
    const roles =
      inputRoles === 'placeholder' || inputRoles === '' ? '' : [inputRoles];
    Axios.post(`${baseApiUrl}/user-management/users`, {
      email: inputEmail,
      password: randomPw,
      roles: roles,
    }).then(res => {
      console.log(res);
      getRolesAndPopulateList();
    });
    e.preventDefault();
  };

  const renderRoles = roles => {
    return (
      <select name="roles" value={inputRoles} onChange={onInputChange}>
        <option key="_placeholder" value="placeholder">
          [select role]
        </option>
        {roles.map(role => {
          return (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          );
        })}
      </select>
    );
  };

  return (
    <UserManagementContainer>
      <div style={{width: '50%'}}>
        <Card height={'auto'} item={{title: 'User Management'}}>
          {users && users.length ? (
            <>
              <div className="list-columns">
                <span>User Name</span>
                <span>Roles</span>
              </div>
              {users.map(user => {
                return (
                  <span className="list-row" key={user.user_id}>
                    <Link
                      className="list-item"
                      to={`${url}/user/${user.user_id}`}
                    >
                      {user.name}
                    </Link>
                    <div className="list-item">
                      {user.roles.map((role, i, arr) => {
                        return (
                          <Link key={role.id} to={`${url}/role/${role.name}`}>
                            {role.name}
                            {arr.length - 1 === i ? '' : ', '}
                          </Link>
                        );
                      })}
                    </div>
                  </span>
                );
              })}
            </>
          ) : (
            <div>Loading....</div>
          )}
        </Card>
      </div>
      <div className="user-creation">
        <div>New User Creation</div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="email"
            id="username"
            name="email"
            value={inputEmail}
            onChange={onInputChange}
          />
          {Array.isArray(roles) && roles.length != 0 && renderRoles(roles)}
          <button>Submit</button>
        </form>
      </div>
    </UserManagementContainer>
  );
};

export default UserManagement;
