describe('LendSwift Dashboard', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the welcome message', () => {
    cy.get('h1').should('contain', 'Welcome back, Alex!');
  });

  it('should navigate to the loan application wizard', () => {
    cy.contains('New Application').click();
    cy.url().should('include', '/apply');
    cy.get('h1').should('contain', 'Loan Application');
  });

  it('should toggle dark mode', () => {
    cy.get('html').should('not.have.class', 'dark');
    cy.contains('Dark Mode').click();
    cy.get('html').should('have.class', 'dark');
    cy.contains('Light Mode').click();
    cy.get('html').should('not.have.class', 'dark');
  });
});
