import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import Axios from 'axios';
import {Card, Icon} from '@ceruleandatahub/react-components';

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
  const [directPermissions, setDirectPermissions] = useState({});
  const [selectedResourceServer, setSelectedResourceServer] = useState(
    'placeholder',
  );
  const [resourceServers, setResourceServers] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

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

    const userPermissionsPromise = Axios.get(
      `${auth0ProxyUrl}/users/${userId}/permissions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then(resp => {
      const perms = resp.data.filter(p =>
        p.sources.some(s => s.source_type === 'DIRECT'),
      );
      perms.map(p => {
        const dirPerms = directPermissions;
        if (!dirPerms[p.resource_server_name]) {
          dirPerms[p.resource_server_name] = [];
        }
        dirPerms[p.resource_server_name].push(p);
        setDirectPermissions(dirPerms);
      });
    });

    Promise.all([userPromise, userRolePromise, userPermissionsPromise]).then(
      ([user, roles]) => {
        setUserData({
          name: user.name,
          userId: user.user_id,
          email: user.email,
          roles: roles,
          // permissions: permissions, // handled in directPermissions state
        });
      },
    );
  };
  const getResourceServers = async () => {
    const token = await getTokenSilently();
    const rs = await Axios.get(`${auth0ProxyUrl}/resource-servers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(resp => resp.data);
    setResourceServers(rs);
  };
  useEffect(() => {
    getUser();
    getResourceServers();
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

  const handlePermissionRemove = async permission => {
    const token = await getTokenSilently();
    Axios.delete(`${auth0ProxyUrl}/users/${userId}/permissions`, {
      data: {permissions: [permission]},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        const serverName = resourceServers.find(
          rs => rs.identifier === permission.resource_server_identifier,
        ).name;
        const dirPermissions = directPermissions;
        dirPermissions[serverName] = directPermissions[serverName].filter(
          perm => perm.permission_name != permission.permission_name,
        );
        setDirectPermissions({...dirPermissions});
      })
      .catch(err => {
        console.log(err);
      });
  };

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
      <div className="current-role" key={role.id}>
        <div className="current-role--name">{role.name}</div>
        <div>
          <Icon name="close" />
          <span onClick={() => handle(role.id)} />
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

  const renderRolesContainer = () => {
    return (
      <div className="role-container">
        {Object.keys(userData).map(key => {
          const value = userData[key];
          if (key === 'roles') {
            return (
              <div className="current-roles--row" key={key}>
                <span className="current-roles--title">Roles:</span>{' '}
                {renderRoles(value)}
              </div>
            );
          }
        })}

        <div className="new-right-container">
          <div className="new-right-container--selection">
            <div className="new-right-container--label">Add new roles</div>
            <select
              className="new-right-container--select"
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
          <div className="new-right--container-rights">
            {selectedRoles.map(role => {
              return renderRole(role, handleRemoveUnsavedRole);
            })}
          </div>
          <button name="save" onClick={saveNewRoles}>
            Save
          </button>
        </div>
      </div>
    );
  };

  const renderPermission = (permission, serverIdentifier, handle) => {
    return (
      <div className="current-permission" key={permission.id}>
        <div className="current-permission--name">{permission.name}</div>
        <div>
          <Icon name="close" />
          <span
            onClick={() =>
              handle({
                resource_server_identifier: serverIdentifier,
                permission_name: permission.name,
              })
            }
          />
        </div>
      </div>
    );
  };
  const renderPermissions = permissions => {
    return permissions.map(p => {
      const perm = {
        id: p.resource_server_identifier + p.permission_name,
        name: p.permission_name,
      };
      return renderPermission(perm, p.resource_server_identifier, () =>
        handlePermissionRemove({
          resource_server_identifier: p.resource_server_identifier,
          permission_name: p.permission_name,
        }),
      );
    });
  };

  const handleResourceServerChange = e => {
    setSelectedPermissions([]);
    setSelectedResourceServer(e.target.value);
  };

  const handleSavePermissions = async () => {
    const token = await getTokenSilently();
    const permissions = [];
    selectedPermissions.map(selectedPermission => {
      permissions.push({
        resource_server_identifier: selectedResourceServer,
        permission_name: selectedPermission,
      });
    });
    Axios.post(
      `${auth0ProxyUrl}/users/${userId}/permissions`,
      {
        permissions: permissions,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then(() => {
      const dirPerms = directPermissions;
      const selectedServerName = resourceServers.find(
        rs => rs.identifier === selectedResourceServer,
      ).name;
      if (!dirPerms[selectedServerName]) {
        dirPerms[selectedServerName] = [];
      }
      selectedPermissions.map(selPerm => {
        dirPerms[selectedServerName].push({
          resource_server_identifier: selectedResourceServer,
          permission_name: selPerm,
        });
      });
      setDirectPermissions(dirPerms);

      setSelectedPermissions([]);
      setSelectedResourceServer('placeholder');
    });
  };

  const handlePermissionSelectionChange = e => {
    const permission = e.target.value;
    setSelectedPermissions([...selectedPermissions, permission]);
  };

  const handleRemoveUnsavedPermission = permission => {
    setSelectedPermissions(
      selectedPermissions.filter(
        selectedPermission => selectedPermission !== permission.permission_name,
      ),
    );
  };

  const renderPermissionContainer = () => {
    return (
      <div className="permission-container">
        {Object.keys(directPermissions).map(key => {
          const value = directPermissions[key];
          return (
            <div className="current-permissions--row" key={key}>
              <div className="current-permission--title">{key}:</div>
              <div className="current-permission--permissions">
                {renderPermissions(value)}
              </div>
            </div>
          );
        })}
        <div className="new-right-container">
          <div className="new-right-container--selection">
            <div className="new-right-container--label">Add new permission</div>
            <select
              className="new-right-container--select"
              onChange={handleResourceServerChange}
              value={selectedResourceServer}
            >
              <option key="_placeholder" value="placeholder">
                [select resource]
              </option>
              {resourceServers &&
                resourceServers.map(resourceServer => {
                  if (
                    resourceServer.identifier ===
                    'https://denim-data-hub.eu.auth0.com/api/v2/'
                  )
                    return;
                  return (
                    <option
                      key={resourceServer.id}
                      value={resourceServer.identifier}
                    >
                      {resourceServer.name}
                    </option>
                  );
                })}
            </select>
            {resourceServers && selectedResourceServer !== 'placeholder' && (
              <select
                className="new-right-container--select"
                onChange={handlePermissionSelectionChange}
                value="placeholer"
              >
                <option key="_placeholder" value="placeholder">
                  [select permission]
                </option>
                {resourceServers
                  .find(server => server.identifier === selectedResourceServer)
                  .scopes.filter(scope => {
                    return !(
                      Object.keys(directPermissions).some(key =>
                        directPermissions[key].some(
                          perm => perm.permission_name === scope.value,
                        ),
                      ) ||
                      selectedPermissions.some(perm => perm === scope.value)
                    );
                  })
                  .map(scope => (
                    <option key={scope.value} value={scope.value}>
                      {scope.value}
                    </option>
                  ))}
              </select>
            )}
          </div>
          <div className="new-right--container-rights">
            {selectedPermissions.map(permission => {
              return renderPermission(
                {id: permission, name: permission},
                selectedResourceServer,
                handleRemoveUnsavedPermission,
              );
            })}
          </div>
          <button
            name="save"
            className="add-permission-user--save-btn"
            onClick={handleSavePermissions}
          >
            Save
          </button>
        </div>
      </div>
    );
  };
  return (
    userData && (
      <UserContainer>
        <Card
          max-width="1200px"
          width="auto"
          height="auto"
          justify-content="flex-start"
        >
          {Object.keys(userData).map(key => {
            const value = userData[key];
            if (!Array.isArray(value)) {
              return (
                <div
                  className="user-details--row"
                  key={key}
                >{`${key}: ${userData[key]}`}</div>
              );
            }
          })}
          {renderRolesContainer()}
          {renderPermissionContainer()}
        </Card>
      </UserContainer>
    )
  );
};

export default User;
