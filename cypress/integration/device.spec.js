import {expect} from 'chai';

context('Device', () => {
  // https://on.cypress.io/interacting-with-elements
  describe('Given they fill the form with warning settings, when they click the submit button', () => {
    beforeEach(() => {
      cy.visit('http://localhost:8080/devices/12345654321');

      cy.get('[data-cy=rule-name-input-e2e-test]').type('e2eTestLowHum');
      cy.get('[data-cy=rule-level-select-e2e-test]').select('Warning');
      cy.get('[data-cy=rule-field-select-e2e-test]').select('humidity');
      cy.get('[data-cy=rule-operator-select-e2e-test]').select('>');
      cy.get('[data-cy=rule-value-select-e2e-test]').type('20');
      cy.get('[data-cy=new-rule-submit-button-e2e-test]').click();
    });

    it('They see a new rule form', () => {
      expect(cy.get('[data-cy=device-container-e2e-test]')).to.exist;
    });

    it('Then they see a new warning rule', () => {
      expect(cy.get('[data-cy=warning-rule-container-e2e-test]')).to.exist;
      cy.get('[data-cy=sub-rule-e2e-test]').should('have.length', 1);
    });

    it("Then clicking on '+' button adds a new rule row", () => {
      cy.get('[data-cy=add-rule-e2e-test-0]').click();
      cy.get('[data-cy=sub-rule-e2e-test]').should('have.length', 2);
    });

    it("Then clicking on '-' button for the first row removes the first row", () => {
      cy.get('[data-cy=delete-rule-e2e-test-0]').click();
      expect(cy.get('[data-cy=sub-rule-e2e-test]')).to.not.exist;
    });
  });
});
