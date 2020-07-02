// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import jwt_decode from 'jwt-decode';

let auth0Key;
let LOCAL_STORAGE_MEMORY = {};
let testRoleId;

Cypress.Commands.add('login', () => {
  Cypress.log({
    name: 'loginViaAuth0',
  });

  const client_id = Cypress.env('auth_client_id');
  const audience = Cypress.env('auth_audience');
  const scope = 'openid profile email';

  const options = {
    method: 'POST',
    url: Cypress.env('auth_url'),
    body: {
      grant_type: 'password',
      username: Cypress.env('auth_username'),
      password: Cypress.env('auth_password'),
      audience,
      scope,
      client_id,
      client_secret: Cypress.env('auth_client_secret'),
    },
  };
  cy.request(options).then(({body}) => {
    const {access_token, expires_in, id_token} = body;
    auth0Key = `@@auth0spajs@@::${client_id}::${audience}::${scope}`;
    const auth0Cache = {
      body: {
        client_id,
        access_token,
        id_token,
        scope,
        expires_in,
        decodedToken: {
          user: jwt_decode(id_token),
        },
      },
      expiresAt: Math.floor(Date.now() / 1000) + expires_in,
    };
    window.localStorage.setItem(auth0Key, JSON.stringify(auth0Cache));
  });
});

Cypress.Commands.add('deleteE2eFakeUser', () => {
  const token = JSON.parse(window.localStorage.getItem(auth0Key)).body
    .access_token;

  const getUsersOption = {
    method: 'GET',
    url: `${Cypress.env('auth_audience')}/auth0/users`,
    headers: {Authorization: 'Bearer ' + token},
  };
  cy.request(getUsersOption).then(({body: users}) => {
    const fakeUser = users.find(u => u.email === 'e2e-fake-user@example.com');
    if (!fakeUser) return;
    const deleteUserOption = {
      method: 'DELETE',
      url: `${Cypress.env('auth_audience')}/auth0/users/${fakeUser.user_id}`,
      headers: {Authorization: 'Bearer ' + token},
    };

    cy.request(deleteUserOption).then(res => {
      console.log('Response ', res);
    });
  });
});

Cypress.Commands.add('addTestRole', () => {
  const token = JSON.parse(window.localStorage.getItem(auth0Key)).body
    .access_token;

  const postNewRoleOption = {
    method: 'POST',
    url: `${Cypress.env('auth_audience')}/auth0/roles`,
    headers: {Authorization: 'Bearer ' + token},
    body: {
      name: 'e2e-test-role',
      description: 'Role for e2e testing',
    },
  };
  cy.request(postNewRoleOption).then(resp => {
    testRoleId = resp.body.id;
    console.log('addTestRole', resp);
  });
});

Cypress.Commands.add('deleteTestRole', () => {
  const token = JSON.parse(window.localStorage.getItem(auth0Key)).body
    .access_token;

  const getRolesOption = {
    method: 'GET',
    url: `${Cypress.env('auth_audience')}/auth0/roles`,
    headers: {Authorization: 'Bearer ' + token},
  };
  cy.request(getRolesOption).then(({body: roles}) => {
    const testRole = roles.find(r => r.name === 'e2e-test-role');
    if (!testRole) return;
    const deleteRoleOption = {
      method: 'DELETE',
      url: `${Cypress.env('auth_audience')}/auth0/roles/${testRole.id}`,
      headers: {Authorization: 'Bearer ' + token},
    };

    cy.request(deleteRoleOption);
  });
});

Cypress.Commands.add('deleteTestPermissions', () => {
  const token = JSON.parse(window.localStorage.getItem(auth0Key)).body
    .access_token;

  const postNewRoleOption = {
    method: 'DELETE',
    url: `${Cypress.env(
      'auth_audience',
    )}/auth0/roles/${testRoleId}/permissions`,
    headers: {Authorization: 'Bearer ' + token},
    body: {
      permissions: [
        {
          resource_server_identifier: 'https://ddh-api.azure-api.net',
          permission_name: 'e2e:test',
        },
      ],
    },
  };
  cy.request(postNewRoleOption);
});

Cypress.Commands.add('saveLocalStorageCache', () => {
  Object.keys(localStorage).forEach(key => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add('restoreLocalStorageCache', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});
