import React, {useState, useEffect} from 'react';
import {Link, useRouteMatch} from 'react-router-dom';
import styled from 'styled-components';
import Axios from 'axios';
import {Card} from '@ceruleandatahub/react-components';

import {useAuth0} from '../../auth0-spa.jsx';
import env from '../../config';

import './RoleManagement.css';

const envVar = env();

const RoleManagementContainer = styled.section`
  margin-left: 18em;
  background-color: #ffffff;
`;

const AUTH0_PROXY_URL = `${envVar.BASE_API_URL}/auth0`;

const RoleManagement = () => {
  const {getTokenSilently} = useAuth0();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    getAllRoles();
  }, []);
  let {url} = useRouteMatch();
  const getAllRoles = async () => {
    const token = await getTokenSilently();
    Axios.get(`${AUTH0_PROXY_URL}/roles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (res.data.status === 404) {
          console.log('Error fetching roles');
        } else {
          setRoles(res.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <RoleManagementContainer>
      <div data-cy-role-management-container-e2e-test style={{width: '50%'}}>
        <Card height={'auto'} item={{title: 'Resource Management'}}>
          {roles && roles.length !== 0 ? (
            <div className="list">
              <div className="list-header">Roles</div>
              {roles.map(role => {
                return (
                  <Link
                    className="list-item"
                    key={role.id}
                    to={`${url}/role/${role.id}`}
                    data-role-name-e2e-test={role.name}
                  >
                    {role.name}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div>Loading....</div>
          )}
        </Card>
      </div>
    </RoleManagementContainer>
  );
};

export default RoleManagement;
