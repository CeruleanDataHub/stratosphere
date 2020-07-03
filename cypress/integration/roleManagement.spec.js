context('Role management', () => {
  describe('The user navigates to the role management page', () => {
    before(() => {
      cy.login();
      cy.addTestRole();
      cy.visit('/');
      cy.saveLocalStorageCache();
    });
    beforeEach(() => {
      cy.restoreLocalStorageCache();
      cy.server();
      cy.route('GET', '/auth0/roles').as('roles');
      cy.route('GET', '/auth0/roles/**/users').as('role-users');
      cy.route('GET', '/auth0/roles/**').as('role');
      cy.route('GET', '/auth0/resource-servers').as('resource-servers');
      cy.route('POST', '/auth0/roles/**/permissions').as('role-permissions');
      cy.visit('/resource-management');
    });

    it('They see the list of the roles', () => {
      expect(cy.get('[data-cy-role-management-container-e2e-test]')).to.exist;
    });

    it('They see the e2e-test-role role in the list of roles ', () => {
      expect(cy.get('[data-role-name-e2e-test=e2e-test-role]')).to.exist;
    });

    describe('The user navigates to the e2e-test-role role page', () => {
      beforeEach(() => {
        cy.get('[data-role-name-e2e-test=e2e-test-role]').click();
      });

      it('They see the e2e-test-role role page', () => {
        expect(cy.get('[data-role-property-e2e-test=e2e-test-role]')).to.exist;
      });

      it('They see the add new permission section', () => {
        expect(cy.get('[data-new-permission-container-e2e-test]')).to.exist;
      });

      describe('The user adds a new permission to the role', () => {
        beforeEach(() => {
          cy.wait('@resource-servers')
            .get('[data-select-resource-e2e-test]')
            .select('denim-data-hub-api-management');
        });

        it('They see the permission select box', () => {
          expect(cy.get('[data-select-permission-e2e-test]')).to.exist;
        });

        describe('When the users chooses the e2e:test permission', () => {
          beforeEach(() => {
            cy.get('[data-select-permission-e2e-test]').select('e2e:test');
          });

          it('Then the permission appears in the selected permissions list ', () => {
            cy.get('[data-selected-permissions-e2e-test]').contains('e2e:test');
          });

          it('When the user clicks on the "X" mark then the selected permission list is empty', () => {
            cy.get('[data-selected-permission-delete-marker]').click();

            cy.get('[data-selected-permissions-e2e-test]')
              .children()
              .should('have.length', 0);
          });

          it('When the user clicks on the "X" mark then the selected permission reappears in the available permissions list', () => {
            cy.get('[data-selected-permission-delete-marker]').click();

            cy.get('[data-select-permission-e2e-test]').contains('e2e:test');
          });

          describe('When the user saves the e2e:test permission', () => {
            beforeEach(() => {
              cy.get('[data-save-button-e2e-test]').click();
            });

            afterEach(() => {
              cy.deleteTestPermissions();
            });

            it('Then the permission appears in the permissions list ', () => {
              cy.get('[data-cy-role-permissions]').contains('e2e:test');
            });

            it('When the user clicks on "X" mark then then the role permission is unassigned', () => {
              cy.wait('@role-permissions')
                .get('[data-selected-permission-delete-marker]')
                .click();
              cy.get('[data-cy-role-permissions]')
                .children()
                .should('have.length', 0);
            });
          });
        });
      });
    });

    after(() => {
      cy.deleteTestRole();
    });
  });
});
