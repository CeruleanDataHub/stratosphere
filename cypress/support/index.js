// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
beforeEach(() => {
  cy.server(); //return 404 for all routes not defined below

  //cy.fixture('users').as('usersJSON')
  cy.fixture('devices').as('devicesJSON');
  cy.fixture('twin').as('twinJSON');
  cy.fixture('roles').as('rolesJSON');
  cy.fixture('role').as('roleJSON');
  cy.fixture('users').as('usersJSON');

  //cy.route('GET', '/users/**', '@usersJSON')
  cy.route('GET', '/device/all', '@devicesJSON');
  cy.route('GET', '/twin/**', '@twinJSON');
  //cy.route('GET', '**/roles', '@rolesJSON');
  //cy.route('GET', '**/roles/**/users', '@roleJSON');
  //cy.route('GET', '**/users', '@usersJSON');
});

// Alternatively you can use CommonJS syntax:
// require('./commands')
