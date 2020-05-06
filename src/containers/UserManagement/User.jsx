import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import Axios from 'axios';
import {Card} from '@denim/react-components';

import env from '../../config';

import './User.css';

const envVar = env();
const baseApiUrl = envVar.BASE_API_URL;
const UserContainer = styled.section`
  margin-left: 18em;
  background-color: #ffffff;
`;

const User = () => {
  const {userId} = useParams();
  const [userData, setUserData] = useState({});
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    Axios.get(`${baseApiUrl}/user-management/user/${userId}`).then(resp =>
      setUserData(resp.data),
    );
  }, []);

  useEffect(() => {
    Axios.get(`${baseApiUrl}/user-management/roles`)
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
  }, []);
  const handleRemoveUnsavedRole = roleId => {
    setSelectedRoles(selectedRoles.filter(role => role.id !== roleId));
  };
  const handleRemoveRole = roleId => {
    Axios.delete(
      `${baseApiUrl}/user-management/user/${userData.user_id}/roles`,
      {
        data: [roleId],
      },
    )
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

  const saveNewRoles = () => {
    Axios.put(
      `${baseApiUrl}/user-management/user/${userData.user_id}/roles`,
      selectedRoles.map(role => role.id),
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
