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

describe('Mensaje e2e test', () => {
  const mensajePageUrl = '/mensaje';
  const mensajePageUrlPattern = new RegExp('/mensaje(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const mensajeSample = {};

  let mensaje;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/mensajes+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/mensajes').as('postEntityRequest');
    cy.intercept('DELETE', '/api/mensajes/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (mensaje) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/mensajes/${mensaje.id}`,
      }).then(() => {
        mensaje = undefined;
      });
    }
  });

  it('Mensajes menu should load Mensajes page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('mensaje');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Mensaje').should('exist');
    cy.url().should('match', mensajePageUrlPattern);
  });

  describe('Mensaje page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(mensajePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Mensaje page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/mensaje/new$'));
        cy.getEntityCreateUpdateHeading('Mensaje');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mensajePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/mensajes',
          body: mensajeSample,
        }).then(({ body }) => {
          mensaje = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/mensajes+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [mensaje],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(mensajePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Mensaje page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('mensaje');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mensajePageUrlPattern);
      });

      it('edit button click should load edit Mensaje page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Mensaje');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mensajePageUrlPattern);
      });

      it('edit button click should load edit Mensaje page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Mensaje');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mensajePageUrlPattern);
      });

      it('last delete button click should delete instance of Mensaje', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('mensaje').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', mensajePageUrlPattern);

        mensaje = undefined;
      });
    });
  });

  describe('new Mensaje page', () => {
    beforeEach(() => {
      cy.visit(`${mensajePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Mensaje');
    });

    it('should create an instance of Mensaje', () => {
      cy.get(`[data-cy="texto"]`).type('Bedfordshire').should('have.value', 'Bedfordshire');

      cy.get(`[data-cy="fecha"]`).type('2023-10-27').blur().should('have.value', '2023-10-27');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        mensaje = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', mensajePageUrlPattern);
    });
  });
});
