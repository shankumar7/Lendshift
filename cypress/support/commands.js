// ***********************************************
// Custom Commands for LendSwift Onboarding
// ***********************************************

Cypress.Commands.add('fillLoanSelection', (title = 'Personal', amount = '500000') => {
  cy.contains(title, { timeout: 10000 }).click({ force: true });
  cy.get('input#amount-slider').invoke('val', amount).trigger('input').trigger('change');
  cy.get('input#tenure-slider').invoke('val', 12).trigger('input').trigger('change');
  cy.get('select#loan-purpose').select(1);
  cy.get('select#employment-type').select(1);
  cy.get('input#monthly-income').clear().type('100000');
  cy.get('#wizard-submit-btn').click({ force: true });
});

Cypress.Commands.add('fillPersonalInfo', () => {
  cy.get('input#firstName', { timeout: 10000 }).type('John');
  cy.get('input#lastName').type('Doe');
  cy.get('input#dob').type('1990-01-01');
  cy.contains('button', /male/i).click({ force: true });
  cy.contains('button', /single/i).click({ force: true });
  cy.get('input#mobileNumber').type('9876543210');
  cy.contains('button', /send otp/i).click({ force: true });
  cy.get('input[placeholder="······"]').type('123456');
  cy.contains('button', /verify code/i).click({ force: true });
  cy.get('input#email').type('john.doe@example.com');
  cy.get('input#panCard').type('ABCDE1234F');
  cy.contains('button', /verify/i)
    .first()
    .click({ force: true });
  cy.get('input#aadhaar').type('123456789012');
  cy.contains('button', /verify/i)
    .last()
    .click({ force: true });
  cy.get('select#occupation').select('salaried');
  cy.get('select#education').select('graduate');
  cy.get('input#annualIncome').type('1200000');
  cy.get('#wizard-submit-btn').click({ force: true });
});

Cypress.Commands.add('completeKYC', () => {
  cy.get('input#pan-input', { timeout: 10000 }).type('ABCDE1234F');
  cy.get('button')
    .contains(/verify/i)
    .first()
    .click({ force: true });
  cy.get('input#aadhaar-input').type('123456789012');
  cy.get('button')
    .contains(/verify/i)
    .last()
    .click({ force: true });
  cy.get('select#id-type-select').select('Indian Passport');
  cy.get('input#id-number-input').type('Z1234567');
  cy.get('input[type="file"]').eq(0).attachFile('test.jpg');
  cy.get('input[type="file"]').eq(1).attachFile('test.jpg');
  cy.get('input[type="file"]').eq(2).attachFile('test.jpg');
  cy.get('button')
    .contains(/capture selfie/i)
    .parent()
    .find('input[type="file"]')
    .attachFile('test.jpg');
  cy.contains('button', /initialize match/i).click({ force: true });
  cy.wait(5000);
  cy.get('#wizard-submit-btn').click({ force: true });
});

Cypress.Commands.add('fillAddress', () => {
  cy.get('input#current-address1', { timeout: 10000 }).type('123 Fintech Street');
  cy.get('input#current-pincode').type('400001');
  cy.wait(3000);
  cy.get('select#residence-type').select('Owned');
  cy.get('select#duration-at-address').select('5+ years');
  cy.get('select#address-proof-type').select('Passport');
  cy.get('input[type="file"]').attachFile('test.jpg');
  cy.get('#wizard-submit-btn').click({ force: true });
});

Cypress.Commands.add('fillEmployment', (type = 'salaried') => {
  cy.get('select#emp-type-select', { timeout: 10000 }).select(type);
  cy.get('input#employer-input').type('Google Cloud');
  cy.get('input#income-input').type('150000');
  cy.get('input#ifsc-input').type('SBIN0001234');
  cy.wait(3000);
  cy.get('#wizard-submit-btn').click({ force: true });
});

Cypress.Commands.add('handleCoApplicant', (skip = true) => {
  if (skip) {
    cy.contains('button', /skip/i, { timeout: 10000 }).click({ force: true });
  } else {
    cy.contains('button', /add co-applicant/i, { timeout: 10000 }).click({ force: true });
  }
});
