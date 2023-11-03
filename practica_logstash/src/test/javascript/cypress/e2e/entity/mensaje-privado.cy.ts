import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('MensajePrivado e2e test', () => {
  const mensajePrivadoPageUrl = '/mensaje-privado';
  const mensajePrivadoPageUrlPattern = new RegExp('/mensaje-privado(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const mensajePrivadoSample = {};

  let mensajePrivado;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/mensaje-privados+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/mensaje-privados').as('postEntityRequest');
    cy.intercept('DELETE', '/api/mensaje-privados/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (mensajePrivado) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/mensaje-privados/${mensajePrivado.id}`,
      }).then(() => {
        mensajePrivado = undefined;
      });
    }
  });

  it('MensajePrivados menu should load MensajePrivados page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('mensaje-privado');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('MensajePrivado').should('exist');
    cy.url().should('match', mensajePrivadoPageUrlPattern);
  });

  describe('MensajePrivado page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(mensajePrivadoPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create MensajePrivado page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/mensaje-privado/new$'));
        cy.getEntityCreateUpdateHeading('MensajePrivado');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mensajePrivadoPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/mensaje-privados',
          body: mensajePrivadoSample,
        }).then(({ body }) => {
          mensajePrivado = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/mensaje-privados+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [mensajePrivado],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(mensajePrivadoPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details MensajePrivado page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('mensajePrivado');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mensajePrivadoPageUrlPattern);
      });

      it('edit button click should load edit MensajePrivado page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('MensajePrivado');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mensajePrivadoPageUrlPattern);
      });

      it('edit button click should load edit MensajePrivado page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('MensajePrivado');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mensajePrivadoPageUrlPattern);
      });

      it('last delete button click should delete instance of MensajePrivado', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('mensajePrivado').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mensajePrivadoPageUrlPattern);

        mensajePrivado = undefined;
      });
    });
  });

  describe('new MensajePrivado page', () => {
    beforeEach(() => {
      cy.visit(`${mensajePrivadoPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('MensajePrivado');
    });

    it('should create an instance of MensajePrivado', () => {
      cy.get(`[data-cy="texto"]`).type('Card').should('have.value', 'Card');

      cy.get(`[data-cy="fecha"]`).type('2023-10-27').blur().should('have.value', '2023-10-27');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        mensajePrivado = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', mensajePrivadoPageUrlPattern);
    });
  });
});
