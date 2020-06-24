context('Dashboard', () => {
  // https://on.cypress.io/interacting-with-elements
  describe('The user navigates to the devices page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:8080/devices');
    });

    it('They see a list of devices', () => {
      expect(cy.get('[data-cy=dashboard-container-e2e-test]')).to.exist;
    });

    it('They click on a device and are redirected to that devices page', () => {
      cy.get('[data-cy=device-button-e2e-test-10218409]').click();
      //
      cy.url().should('include', '/10218409');
      expect(cy.get('[data-cy=device-container-e2e-test]')).to.exist;
    });
  });
});
