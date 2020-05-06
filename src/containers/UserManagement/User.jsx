import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import Axios from 'axios';
import {Card} from '@denim/react-components';
import {useAuth0} from '../../auth0-spa.jsx';

import env from '../../config';

import './User.css';

const envVar = env();
const auth0ProxyUrl = envVar.AUTH0_PROXY_URL;

const UserContainer = styled.section`
  margin-left: 18em;
  background-color: #ffffff;
`;

const User = () => {
  const {getTokenSilently} = useAuth0();
  const {userId} = useParams();
  const [userData, setUserData] = useState({});
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const getUser = async () => {
    const token = await getTokenSilently();
    const userPromise = Axios.get(`${auth0ProxyUrl}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(resp => resp.data);

    const userRolePromise = Axios.get(
      `${auth0ProxyUrl}/users/${userId}/roles`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then(resp => resp.data);

    Promise.all([userPromise, userRolePromise]).then(([user, roles]) => {
      setUserData({
        name: user.name,
        userId: user.user_id,
        email: user.email,
        roles: roles,
      });
    });
  };

  useEffect(() => {
    getUser();
  }, []);

  const getRoles = async () => {
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
          setRoles(roles);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  useEffect(() => {
    getRoles();
  }, []);

  const handleRemoveUnsavedRole = roleId => {
    setSelectedRoles(selectedRoles.filter(role => role.id !== roleId));
  };
  const handleRemoveRole = async roleId => {
    const token = await getTokenSilently();
    Axios.delete(`${auth0ProxyUrl}/users/${userData.userId}/roles`, {
      data: {roles: [roleId]},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setUserData({
          ...userData,
          roles: userData.roles.filter(role => role.id !== roleId),
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
  const renderRole = (role, handle) => {
    return (
      <div className="role" key={role.id}>
        <div className="role-name">{role.name}</div>
        <div>
          <span
            className="lnr lnr-cross delete-marker"
            onClick={() => handle(role.id)}
          />
        </div>
      </div>
    );
  };
  const renderRoles = roles => {
    return roles.map(role => {
      return renderRole(role, handleRemoveRole);
    });
  };

  const handleRoleUpdate = e => {
    const role = JSON.parse(e.target.value);
    setSelectedRoles([...selectedRoles, role]);
  };

  const userHasRole = role =>
    userData.roles.some(userRole => userRole.id === role.id);

  const roleIsSelected = role =>
    selectedRoles.some(selectedRole => selectedRole.id === role.id);

  const saveNewRoles = async () => {
    const token = await getTokenSilently();
    Axios.post(
      `${auth0ProxyUrl}/users/${userData.userId}/roles`,
      {roles: selectedRoles.map(role => role.id)},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then(
      () =>
        setUserData({
          ...userData,
          roles: [...userData.roles, ...selectedRoles],
        }),
      setSelectedRoles([]),
    );
  };
  return (
    userData && (
      <UserContainer>
        <Card
          max-width="800px"
          width="auto"
          height="auto"
          justify-content="flex-start"
        >
          <div className="roles">
            <div className="current-roles">
              {Object.keys(userData).map(key => {
                const value = userData[key];
                if (Array.isArray(value)) {
                  return (
                    <div className="row" key={key}>
                      <span className="role-title">Roles:</span>{' '}
                      {renderRoles(value)}
                    </div>
                  );
                } else {
                  return (
                    <div
                      className="row"
                      key={key}
                    >{`${key}: ${userData[key]}`}</div>
                  );
                }
              })}
            </div>
            <div className="new-roles-container">
              <div className="new-roles-container--selection">
                <div className="new-roles-container--label">Add new roles</div>
                <select
                  className="new-roles-container--select"
                  onChange={handleRoleUpdate}
                  value={'placeholder'}
                >
                  <option key="_placeholder" value="placeholder">
                    [select role]
                  </option>
                  {userData.roles &&
                    roles &&
                    roles
                      .filter(role => {
                        return !userHasRole(role) && !roleIsSelected(role);
                      })
                      .map(role => {
                        return (
                          <option key={role.id} value={JSON.stringify(role)}>
                            {role.name}
                          </option>
                        );
                      })}
                </select>
              </div>
              <div className="new-roles--container-save-roles">
                {selectedRoles.map(role => {
                  return renderRole(role, handleRemoveUnsavedRole);
                })}
              </div>
              <button name="save" onClick={saveNewRoles}>
                Save
              </button>
            </div>
          </div>
        </Card>
      </UserContainer>
    )
  );
};

export default User;
