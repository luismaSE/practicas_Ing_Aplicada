describe('template spec', () => {
    it('passes', () => {
        cy.visit('https://biblioteca.um.edu.ar/');
        cy.get('#translControl1').click();
        cy.get('#translControl1').type('pressman');
        cy.get('#searchsubmit').click();
        cy.url().should('contains', 'https://biblioteca.um.edu.ar/cgi-bin/koha/opac-search.pl');
        cy.get('#title_summary_60480 > .title').should("contain.text", "INGENIERIA DEL SOFTWARE")
        cy.get('#title_summary_60481 > .title').should("contain.text", "INGENIERIA DEL SOFTWARE")
        cy.get("#bookbag_form > table > tbody > tr").should("have.length", 2)
        cy.get("#title_summary_60480 > a")
    })
})
