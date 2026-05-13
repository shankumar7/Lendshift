// ***********************************************
// Custom Commands for LendSwift Onboarding
// ***********************************************

Cypress.Commands.add('fillLoanSelection', (type = 'personal', amount = '500000') => {
  cy.get('input[type="radio"]').each(($el) => {
    if ($el.val() === type) cy.wrap($el).click({ force: true });
  });
  cy.get('input[type="range"]').invoke('val', amount).trigger('change');
  cy.get('button')
    .contains(/continue/i)
    .click();
});

Cypress.Commands.add('fillPersonalInfo', () => {
  cy.get('input[placeholder*="First Name"]').type('John');
  cy.get('input[placeholder*="Last Name"]').type('Doe');
  cy.get('input[type="date"]').type('1990-01-01');
  cy.get('select').first().select('Male');
  cy.get('input[placeholder*="Mobile Number"]').type('9876543210');
  cy.get('input[placeholder*="Email Address"]').type('john.doe@example.com');
  cy.get('input[placeholder*="PAN Number"]').type('ABCDE1234F');
  cy.get('button')
    .contains(/verify/i)
    .click();
  cy.get('button')
    .contains(/continue/i)
    .click();
});

Cypress.Commands.add('completeKYC', () => {
  cy.get('button')
    .contains(/start biometric/i)
    .click();
  // Simulate face verification delay
  cy.wait(3500);
  cy.get('button')
    .contains(/continue/i)
    .click();
});

Cypress.Commands.add('fillAddress', () => {
  cy.get('input[placeholder*="Address Line 1"]').type('123 Fintech Street');
  cy.get('input[placeholder*="City"]').type('Mumbai');
  cy.get('input[placeholder*="Pincode"]').type('400001');
  cy.get('select').select('Owned');
  cy.get('button')
    .contains(/verify location/i)
    .click();
  cy.wait(2000);
  cy.get('button')
    .contains(/continue/i)
    .click();
});

Cypress.Commands.add('fillEmployment', (type = 'salaried') => {
  cy.get('select').first().select(type);
  cy.get('input[placeholder*="Employer"]').type('Google Cloud');
  cy.get('input[placeholder*="Net Income"]').type('150000');
  cy.get('input[placeholder*="IFSC"]').type('SBIN0001234');
  cy.wait(2000); // Bank lookup
  cy.get('button')
    .contains(/continue/i)
    .click();
});

Cypress.Commands.add('handleCoApplicant', (skip = true) => {
  if (skip) {
    cy.get('button').contains(/skip/i).click();
  } else {
    cy.get('button')
      .contains(/add co-applicant/i)
      .click();
    cy.get('input[placeholder*="Full Name"]').type('Jane Doe');
    // ... fill more if needed
  }
});
