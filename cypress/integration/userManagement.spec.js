context('UserManagement', () => {
  // https://on.cypress.io/interacting-with-elements

  describe('The user navigates to the user management page', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.login();
      cy.server();
      cy.route('GET', '/auth0/users').as('users');
      cy.route('GET', '/auth0/roles').as('roles');
      cy.route('GET', '/auth0/roles/**/users').as('role-users');
      // cy.route('POST', '/auth0/users').as('userCreation');

      cy.visit('/user-management');
    });

    it('They see the user management component', () => {
      expect(cy.get('[data-cy-user-management-container-e2e-test]')).to.exist;
    });

    it('They see the user list (from Auth0)', () => {
      cy.get('[data-cy-user-name-e2e-test]').its('length').should('be.gt', 1);
    });

    it('They see the e2e test user with the admin role', () => {
      cy.get('[data-cy-user-name-e2e-test]')
        .contains('e2e-testing@cdh.management')
        .siblings()
        .contains('admin');
    });

    it('They create a new user (in Auth0) and see it in the user list', () => {
      cy.wait('@roles')
        .wait('@users')
        .wait('@role-users')
        .then(() => {
          cy.get(
            '[data-cy-user-creation-input-e2e-test]',
          ).type('e2e-fake-user@example.com', {force: true});

          cy.get('[data-cy-user-creation-submit-e2e-test]').click();
          cy.get('[data-cy-user-link-e2e-test="e2e-fake-user@example.com"]');
        });
    });

    after(() => {
      cy.deleteE2eFakeUser();
    });
  });
});
