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

describe('Usuario e2e test', () => {
  const usuarioPageUrl = '/usuario';
  const usuarioPageUrlPattern = new RegExp('/usuario(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const usuarioSample = {};

  let usuario;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/usuarios+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/usuarios').as('postEntityRequest');
    cy.intercept('DELETE', '/api/usuarios/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (usuario) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/usuarios/${usuario.id}`,
      }).then(() => {
        usuario = undefined;
      });
    }
  });

  it('Usuarios menu should load Usuarios page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('usuario');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Usuario').should('exist');
    cy.url().should('match', usuarioPageUrlPattern);
  });

  describe('Usuario page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(usuarioPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Usuario page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/usuario/new$'));
        cy.getEntityCreateUpdateHeading('Usuario');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', usuarioPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/usuarios',
          body: usuarioSample,
        }).then(({ body }) => {
          usuario = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/usuarios+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [usuario],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(usuarioPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Usuario page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('usuario');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', usuarioPageUrlPattern);
      });

      it('edit button click should load edit Usuario page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Usuario');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', usuarioPageUrlPattern);
      });

      it('edit button click should load edit Usuario page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Usuario');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', usuarioPageUrlPattern);
      });

      it('last delete button click should delete instance of Usuario', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('usuario').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', usuarioPageUrlPattern);

        usuario = undefined;
      });
    });
  });

  describe('new Usuario page', () => {
    beforeEach(() => {
      cy.visit(`${usuarioPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Usuario');
    });

    it('should create an instance of Usuario', () => {
      cy.get(`[data-cy="alias"]`).type('Illinois Administrator').should('have.value', 'Illinois Administrator');

      cy.get(`[data-cy="nombre"]`).type('program Vista synthesize').should('have.value', 'program Vista synthesize');

      cy.get(`[data-cy="correo"]`).type('invoice New bandwidth').should('have.value', 'invoice New bandwidth');

      cy.get(`[data-cy="contrasenia"]`).type('Missouri').should('have.value', 'Missouri');

      cy.get(`[data-cy="descripcion"]`).type('Granite').should('have.value', 'Granite');

      cy.get(`[data-cy="admin"]`).should('not.be.checked');
      cy.get(`[data-cy="admin"]`).click().should('be.checked');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        usuario = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', usuarioPageUrlPattern);
    });
  });
});
