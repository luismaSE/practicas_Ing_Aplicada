describe('template spec', () => {
  it('passes', () => {

    //! Inicio de sesion
    cy.visit('https://virtual.um.edu.ar');
    cy.get('#username').click();
    cy.get('#username').type('lm.sarmiento');
    cy.get('#password').type('tomorrow619um');   //* primero establecer la variable de entorno
    cy.get('#loginbtn').click();

    cy.visit('https://virtual.um.edu.ar/mod/questionnaire/complete.php?id=210589')
    cy.get('#auto-rb0001').click();
    cy.get('#dropSelecciòn').select('4053');
    cy.get('.buttons > .btn').click();
    cy.url().should('contains', 'https://virtual.um.edu.ar/mod/questionnaire/complete.php');
    cy.get('.mod_questionnaire_completepage button.btn.btn-secondary').click();
    cy.url().should('contains', 'https://virtual.um.edu.ar/mod/questionnaire/myreport.php');

  })
})
