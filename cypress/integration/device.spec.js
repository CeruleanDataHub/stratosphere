const {expect} = require('chai');

context('Dashboard', () => {
  // https://on.cypress.io/interacting-with-elements
  describe('The user navigates to the device page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:8080/devices/14034147');
    });

    it('They see a new rule form', () => {
      expect(cy.get('[data-cy=device-container-e2e-test]')).to.exist;
    });

    describe('Given they fill the form with warning settings, when they click the submit button', () => {
      beforeEach(() => {
        cy.get('[data-cy=rule-name-input-e2e-test]').type('e2eTestLowHum');
        cy.get('[data-cy=rule-level-select-e2e-test]').select('Warning');
        cy.get('[data-cy=rule-field-select-e2e-test]').select('humidity');
        cy.get('[data-cy=rule-operator-select-e2e-test]').select('<');
        cy.get('[data-cy=rule-value-select-e2e-test]').type('20');

        cy.get('[data-cy=new-rule-submit-button-e2e-test]').click();
      });

      it('then they see a new warning rule', () => {
        expect(cy.get('[data-cy=warning-rule-container-e2e-test]')).to.exist;
      });

      it('add rule', () => {
        cy.get('[data-cy=add-rule-e2e-test]').click();
      });
    });
  });
});
