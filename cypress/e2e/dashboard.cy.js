describe('LendSwift Landing Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the main headline', () => {
    cy.get('h1').should('contain', 'Capital that');
  });

  it('should navigate to the loan application wizard via Apply link', () => {
    cy.get('nav').contains(/Apply/i).click();
    cy.url().should('include', '/apply');
  });

  it('should display the footer with company name', () => {
    cy.get('footer').should('contain', 'Zetheta Algorithms Private Limited');
  });
});
