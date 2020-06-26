context('UserManagement', () => {
  // https://on.cypress.io/interacting-with-elements
  describe('The user navigates to the user management page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:8080/user-management');
    });

    it('They see a list of users', () => {
      expect(cy.get('[data-cy=user-management-container-e2e-test]')).to.exist;
    });

    it('They see at least one user', () => {
      expect(cy.get('[data-cy=user-link-e2e-test]')).to.exist;
    });

    /*it('They click on a device and are redirected to that devices page', () => {
      cy.get('[data-cy=device-link-e2e-test]').first().click();

      expect(cy.get('[data-cy=device-container-e2e-test]')).to.exist;
    });*/
  });
});
