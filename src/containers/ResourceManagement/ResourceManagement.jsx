import React, {useState, useEffect} from 'react';
import {Link, useRouteMatch} from 'react-router-dom';
import styled from 'styled-components';
import Axios from 'axios';
import {Card} from '@denim/react-components';

import {useAuth0} from '../../auth0-spa.jsx';
import env from '../../config';

import './ResourceManagement.css';

const envVar = env();

const ResourceManagementContainer = styled.section`
  margin-left: 18em;
  background-color: #ffffff;
`;

const AUTH0_PROXY_URL = envVar.AUTH0_PROXY_URL;

const ResourceManagement = () => {
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
    <ResourceManagementContainer>
      <div style={{width: '50%'}}>
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
    </ResourceManagementContainer>
  );
};

export default ResourceManagement;
