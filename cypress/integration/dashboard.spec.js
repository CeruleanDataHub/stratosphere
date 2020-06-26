context('Dashboard', () => {
  // https://on.cypress.io/interacting-with-elements
  describe('The user navigates to the devices page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:8080/devices');
    });

    it('They see a list of devices', () => {
      expect(cy.get('[data-cy=dashboard-container-e2e-test]')).to.exist;
    });

    it('They see the same number of nodes as returned from the backend', () => {
      cy.get('[data-cy=device-link-e2e-test]').then(deviceList => {
        const listingCount = Cypress.$(deviceList).length;

        const getDevices = window =>
          window.store
            .getState()
            .devices.all.filter(device => device.type === 'node');

        cy.window().then(getDevices).should('have.length', listingCount);
      });
    });

    it('They click on a device and are redirected to that devices page', () => {
      cy.get('[data-cy=device-link-e2e-test]').first().click();

      expect(cy.get('[data-cy=device-container-e2e-test]')).to.exist;
    });
  });
});
