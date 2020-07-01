context('UserManagement', () => {
  // https://on.cypress.io/interacting-with-elements
  describe('The user navigates to the user management page', () => {
    beforeEach(() => {});

    it('They see a list of users', () => {
      cy.visit('/');
      cy.login();
      cy.visit('/user-management');
      expect(cy.get('[data-cy=user-management-container-e2e-test]')).to.exist;
    });
  });
});
