import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Axios from 'axios';
import {useRouteMatch, Link} from 'react-router-dom';
import {useAuth0} from '../../auth0-spa.jsx';
import {Card} from '@ceruleandatahub/react-components';

import './UserManagement.css';

import env from '../../config';

const UserManagementContainer = styled.section`
  margin-left: 18em;
  background-color: #ffffff;
`;

const envVar = env();
const auth0ProxyUrl = `${envVar.BASE_API_URL}/auth0`;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const {getTokenSilently} = useAuth0();

  const [inputEmail, setInputEmail] = useState('');
  let {url} = useRouteMatch();

  useEffect(() => {
    getRolesAndPopulateList();
  }, []);

  const getRolesAndPopulateList = async () => {
    const token = await getTokenSilently();
    Axios.get(`${auth0ProxyUrl}/roles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async res => {
        if (res.data.status === 404) {
          console.log('Error fetching roles');
        } else {
          const roles = res.data;
          const users = await getUsers();
          setUsersWithRoles(users, roles);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const setUsersWithRoles = async (users, roles) => {
    if (!roles) return;
    const token = await getTokenSilently();
    const responsePromises = roles.map(role => {
      return Axios.get(`${auth0ProxyUrl}/roles/${role.id}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(resp => {
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
    });
  };

  const getUsers = async () => {
    const token = await getTokenSilently();
    return Axios.get(`${auth0ProxyUrl}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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
    e.preventDefault();
    if (e.target.name === 'email') {
      setInputEmail(e.target.value);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await getTokenSilently();
    const randomPw = 'xp&T/.p"z4Ksa2E_';

    Axios.post(
      `${auth0ProxyUrl}/users`,
      {
        email: inputEmail,
        password: randomPw,
        connection: 'Username-Password-Authentication',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then(() => {
      getRolesAndPopulateList();
    });
  };

  return (
    <UserManagementContainer>
      <div data-cy-user-management-container-e2e-test style={{width: '50%'}}>
        <Card height={'auto'} item={{title: 'User Management'}}>
          {users && users.length !== 0 ? (
            <>
              <div className="list-columns">
                <span>User Name</span>
                <span>Roles</span>
              </div>
              {users.map(user => {
                return (
                  <span
                    data-cy-user-name-e2e-test
                    className="list-row"
                    key={user.user_id}
                  >
                    <Link
                      data-cy-user-link-e2e-test={user.name}
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
            data-cy-user-creation-input-e2e-test
            value={inputEmail}
            onChange={onInputChange}
          />
          <button data-cy-user-creation-submit-e2e-test>Submit</button>
        </form>
      </div>
    </UserManagementContainer>
  );
};

export default UserManagement;
