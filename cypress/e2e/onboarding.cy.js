describe('LendSwift Onboarding E2E', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('http://localhost:5173/apply');
    cy.get('body', { timeout: 15000 }).should('be.visible');
  });

  it('completes the Personal Loan Happy Path', () => {
    cy.fillLoanSelection('Personal', '500000');
    cy.fillPersonalInfo();
    cy.completeKYC();
    cy.fillAddress();
    cy.fillEmployment('salaried');

    // Step 6 should be automatically skipped since amount <= 500000
    // Step 7: Documents
    cy.contains(/digital dossier/i, { timeout: 15000 }).should('be.visible');
  });

  it('enforces Cross-Step Validation for Home Loans', () => {
    cy.fillLoanSelection('Mortgage', '5000000', 120);
    cy.fillPersonalInfo();
    cy.completeKYC();
    cy.fillAddress();
    cy.fillEmployment('salaried');

    // Step 6: Co-applicant
    cy.contains(/skip/i).should('not.exist');
    cy.contains(/co-applicant/i, { timeout: 15000 }).should('be.visible');
  });

  it('verifies Session Recovery & Autosave', () => {
    cy.fillLoanSelection('Personal', '300000');
    cy.get('input#firstName', { timeout: 10000 }).type('RecoveryTest');
    cy.wait(4000);

    cy.visit('http://localhost:5173/apply');

    // Resume Modal
    cy.contains(/Resume Application/i, { timeout: 15000 }).should('be.visible');
    cy.contains(/Continue Application/i).click({ force: true });

    // Restored data
    cy.get('input#firstName', { timeout: 15000 }).should('have.value', 'RecoveryTest');
  });

  it('validates Keyboard Navigation (Accessibility)', () => {
    cy.get('select#loan-purpose').select('Medical');
    cy.get('select#employment-type').select('salaried');
    
    cy.get('input[type="range"]').first().focus();
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Tab');
    cy.realPress('Enter');

    cy.contains(/Personal Info/i, { timeout: 15000 }).should('be.visible');
  });

  it('maintains Underwriting Intelligence during data entry', () => {
    cy.fillLoanSelection('Personal', '1000000');
    cy.fillPersonalInfo();
    cy.completeKYC();
    cy.fillAddress();
    cy.fillEmployment('salaried');
    cy.handleCoApplicant(true); // Amount is 1,000,000, so Step 6 appears

    cy.contains(/digital dossier/i, { timeout: 15000 }).should('be.visible');
  });

  it('prevents Invalid Submissions', () => {
    cy.visit('http://localhost:5173/apply/step/8');
    cy.url({ timeout: 15000 }).should('include', 'step/1');
  });
});
