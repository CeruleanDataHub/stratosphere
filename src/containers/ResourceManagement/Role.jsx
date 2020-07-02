import React from 'react';
import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import env from '../../config';
import {useAuth0} from '../../auth0-spa.jsx';
import Axios from 'axios';
import styled from 'styled-components';

import './Role.css';
const envVar = env();
const auth0ProxyUrl = envVar.AUTH0_PROXY_URL;

const RoleContainer = styled.section`
  margin-left: 18em;
  background-color: #ffffff;
`;

const Role = () => {
  const {roleId} = useParams();
  const [role, setRole] = useState({});
  const {getTokenSilently} = useAuth0();
  const [resourceServers, setResourceServers] = useState([]);
  const [selectedResourceServer, setSelectedResourceServer] = useState(
    'placeholder',
  );
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    getRole(roleId);
    getResourceServers();
  }, []);

  const getResourceServers = async () => {
    const token = await getTokenSilently();
    const rs = await Axios.get(`${auth0ProxyUrl}/resource-servers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(resp => resp.data);
    setResourceServers(rs);
  };

  const getRole = async roleId => {
    const token = await getTokenSilently();
    const rolePromise = Axios.get(`${auth0ProxyUrl}/roles/${roleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(resp => resp.data);

    const rolePermissionsPromise = Axios.get(
      `${auth0ProxyUrl}/roles/${roleId}/permissions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then(resp => {
      const rolesResp = resp.data;
      const permissions = [];
      rolesResp.map(role => {
        if (
          !permissions.some(perm => perm.id === role.resource_server_identifier)
        ) {
          permissions.push({
            id: role.resource_server_identifier,
            name: role.resource_server_name,
            permissions: [
              {
                name: role.permission_name,
                description: role.description,
              },
            ],
          });
        } else {
          permissions
            .filter(perm => perm.id === role.resource_server_identifier)
            .map(perm => {
              perm.permissions.push({
                name: role.permission_name,
                description: role.description,
              });
              return perm;
            });
        }
      });

      return permissions;
    });

    Promise.all([rolePromise, rolePermissionsPromise]).then(
      ([role, permissions]) => {
        setRole({
          ...role,
          permissions: permissions,
        });
      },
    );
  };

  const handlePermissionRemove = async permission => {
    const token = await getTokenSilently();
    Axios.delete(`${auth0ProxyUrl}/roles/${roleId}/permissions`, {
      data: {permissions: [permission]},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        const newPermissions = role.permissions.map(serverPermission => {
          if (serverPermission.id === permission.resource_server_identifier) {
            serverPermission.permissions = serverPermission.permissions.filter(
              perm => permission.permission_name !== perm.name,
            );
          }
          return serverPermission;
        });
        setRole({
          ...role,
          permissions: newPermissions,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleRemoveUnsavedPermission = permission => {
    setSelectedPermissions(
      selectedPermissions.filter(
        selectedPermission => selectedPermission !== permission.permission_name,
      ),
    );
  };

  const renderPermission = (permissionName, serverIdentifier, handle) => {
    return (
      <div className="permission" key={permissionName}>
        <div className="permission-name">{permissionName}</div>
        <div>
          <span
            className="lnr lnr-cross delete-marker"
            onClick={() =>
              handle({
                resource_server_identifier: serverIdentifier,
                permission_name: permissionName,
              })
            }
          />
        </div>
      </div>
    );
  };

  const renderResourceServers = servers => {
    return servers.map(server => (
      <div className="resource" key={server.id}>
        <div className="resource-name">{server.name}</div>
        <div className="permissions">
          {server.permissions.map(permission =>
            renderPermission(
              permission.name,
              server.id,
              handlePermissionRemove,
            ),
          )}
        </div>
      </div>
    ));
  };

  const handleResourceServerChange = e => {
    setSelectedPermissions([]);
    setSelectedResourceServer(e.target.value);
  };

  const handlePermissionSelectionChange = e => {
    const permission = e.target.value;
    setSelectedPermissions([...selectedPermissions, permission]);
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
      `${auth0ProxyUrl}/roles/${roleId}/permissions`,
      {
        permissions: permissions,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then(() => {
      const newPermissions = role.permissions.map(serverPermission => {
        if (serverPermission.id === selectedResourceServer) {
          selectedPermissions.map(perm => {
            serverPermission.permissions.push({name: perm, description: ''});
          });
        }
        return serverPermission;
      });
      setRole({
        ...role,
        permissions: newPermissions,
      });
      setSelectedPermissions([]);
      setSelectedResourceServer('placeholder');
    });
  };

  return (
    <RoleContainer>
      {Object.keys(role).map(key => {
        const value = role[key];
        if (key === 'id') return;
        if (key === 'permissions') {
          return (
            <div className="row" key={key}>
              <span className="permission-title">Permissions:</span>{' '}
              <div className="resources">{renderResourceServers(value)}</div>
            </div>
          );
        } else {
          return (
            <div className="row" key={key}>
              <div>{key}:</div> <div>{role[key]}</div>
            </div>
          );
        }
      })}
      <div className="new-permission-container">
        <div className="new-permission-container--selection">
          <div className="new-permission-container--label">
            Add new permission
          </div>
          <select
            className="server-identifier-container--select"
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
                  'https://cerulean-data-hub.eu.auth0.com/api/v2/'
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
              className="scope-container--select"
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
                    role.permissions
                      .find(
                        serverPermission =>
                          serverPermission.id === selectedResourceServer,
                      )
                      .permissions.some(
                        permission => permission.name === scope.value,
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
          <div className="new-permission--container-save-permissions">
            <div className="permissions">
              {selectedPermissions.map(permission => {
                return renderPermission(
                  permission,
                  selectedResourceServer,
                  handleRemoveUnsavedPermission,
                );
              })}
            </div>
          </div>
          <button name="save" onClick={handleSavePermissions}>
            Save
          </button>
        </div>
      </div>
    </RoleContainer>
  );
};

export default Role;
