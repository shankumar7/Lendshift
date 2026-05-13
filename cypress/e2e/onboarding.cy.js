describe('LendSwift Onboarding E2E', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    // Wait for the app to initialize
    cy.get('body').should('be.visible');
  });

  it('completes the Personal Loan Happy Path', () => {
    // Step 1: Loan Selection
    cy.fillLoanSelection('personal', '500000');

    // Step 2: Personal Info
    cy.fillPersonalInfo();

    // Step 3: KYC
    cy.completeKYC();

    // Step 4: Address
    cy.fillAddress();

    // Step 5: Employment
    cy.fillEmployment('salaried');

    // Step 6: Co-Applicant (Optional for < 5L but we set 5L in Step 1)
    cy.handleCoApplicant(true);

    // Step 7: Documents
    cy.get('h4')
      .contains(/digital dossier/i)
      .should('be.visible');
    // Simulation: Verification dashboard should show status
    cy.get('p')
      .contains(/awaiting submission/i)
      .should('be.visible');
  });

  it('enforces Cross-Step Validation for Home Loans', () => {
    // Step 1: Home Loan
    cy.fillLoanSelection('home', '5000000');

    // Fast track to Step 6
    cy.fillPersonalInfo();
    cy.completeKYC();
    cy.fillAddress();
    cy.fillEmployment('salaried');

    // Step 6: Co-applicant should NOT have a "Skip" button for Home Loan
    cy.get('button').contains(/skip/i).should('not.exist');
    cy.get('h3')
      .contains(/co-borrower details/i)
      .should('be.visible');
  });

  it('verifies Session Recovery & Autosave', () => {
    cy.fillLoanSelection('personal', '300000');
    cy.get('input[placeholder*="First Name"]').type('RecoveryTest');

    // Wait for autosave
    cy.wait(2000);

    // Reload page
    cy.reload();

    // Resume Modal should appear
    cy.get('h2')
      .contains(/resume application/i)
      .should('be.visible');
    cy.get('button')
      .contains(/continue application/i)
      .click();

    // Check if data is restored
    cy.get('input[placeholder*="First Name"]').should('have.value', 'RecoveryTest');
  });

  it('validates Keyboard Navigation (Accessibility)', () => {
    cy.get('body').tab();
    cy.focused().should('have.attr', 'role', 'radio');

    // Press Enter on a focused input to trigger next step (simulated)
    cy.get('input[type="range"]').tab().focus();
    // Since the continue button is a button, we can focus it too
    cy.get('button')
      .contains(/continue/i)
      .focus()
      .realPress('Enter');

    // Focus should move to Step 2 heading
    cy.get('h3')
      .contains(/Personal Details/i)
      .should('be.focused' || 'be.visible');
  });

  it('maintains Underwriting Intelligence during data entry', () => {
    cy.fillLoanSelection('personal', '1000000');
    cy.fillPersonalInfo();
    cy.completeKYC();
    cy.fillAddress();

    // Step 5: High income should boost score
    cy.get('select').first().select('salaried');
    cy.get('input[placeholder*="Net Income"]').type('500000');

    // Global Orchestrator should show "Premium" or "Preferred"
    cy.get('p')
      .contains(/institutional score/i)
      .parent()
      .find('p')
      .last()
      .should('contain', '8');
  });

  it('prevents Invalid Submissions', () => {
    cy.visit('http://localhost:5173/apply/step/8');
    // If user tries to access step 8 directly without data, it should redirect or show issues
    // Our wizard redirects to current step or prevents progress
    cy.url().should('not.contain', 'step/8');
  });
});
