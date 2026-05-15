// ***********************************************
// Custom Commands for LendSwift Onboarding
// ***********************************************

Cypress.Commands.add('fillLoanSelection', (title = 'Personal', amount = '500000', tenure = 12, purpose = null) => {
  cy.contains(title, { timeout: 10000 }).click({ force: true });
  cy.wait(300); // allow loan type switch to update slider bounds

  // Set amount slider — must use nativeInputValueSetter for React controlled inputs
  cy.get('input#amount-slider').then(($el) => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call($el[0], amount);
    $el[0].dispatchEvent(new Event('input', { bubbles: true }));
    $el[0].dispatchEvent(new Event('change', { bubbles: true }));
  });

  // Set tenure slider
  cy.get('input#tenure-slider').then(($el) => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call($el[0], String(tenure));
    $el[0].dispatchEvent(new Event('input', { bubbles: true }));
    $el[0].dispatchEvent(new Event('change', { bubbles: true }));
  });

  if (!purpose) {
    purpose = title === 'Mortgage' ? 'Purchase of Plot' : 'Medical';
  }
  cy.get('select#loan-purpose').select(purpose);
  cy.get('select#employment-type').select('salaried');
  cy.get('input#monthly-income').clear().type('500000');
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
  cy.get('input#panCard').type('ABCPD1234F');
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
  cy.get('input#pan-input', { timeout: 10000 }).type('ABCPD1234F');
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
  cy.get('select#emp-type-select', { timeout: 10000 }).select(type, { force: true });
  cy.wait(500); // wait for dynamic fields to render

  if (type === 'salaried') {
    cy.get('input[placeholder="e.g. Google India Pvt Ltd"]', { timeout: 5000 }).type('Google Cloud', { force: true });
    cy.get('input[placeholder="₹ 0.00"]').type('500000', { force: true });
  } else if (type === 'business') {
    cy.get('input[placeholder="Legal Business Name"]', { timeout: 5000 }).type('Acme Corp', { force: true });
    cy.get('input[placeholder="Annual Business Turnover"]').type('6000000', { force: true });
  } else if (type === 'self-employed') {
    cy.get('input[placeholder="Annual Revenue"]', { timeout: 5000 }).type('6000000', { force: true });
  } else if (type === 'freelancer') {
    cy.get('input[placeholder="e.g. UI/UX Design"]', { timeout: 5000 }).type('Software Development', { force: true });
    cy.get('input[placeholder="Average Monthly Income"]').type('500000', { force: true });
  }

  cy.get('input[placeholder="HDFC0001234"]', { timeout: 5000 }).type('SBIN0001234', { force: true });
  cy.wait(3500); // wait for IFSC lookup simulation
  // Account type is required by the schema
  cy.get('select#account-type-select', { timeout: 5000 }).select('savings', { force: true });
  cy.get('#wizard-submit-btn').click({ force: true });
});

Cypress.Commands.add('handleCoApplicant', (skip = true) => {
  if (skip) {
    cy.contains('button', /skip/i, { timeout: 10000 }).click({ force: true });
  } else {
    cy.contains('button', /add co-applicant/i, { timeout: 10000 }).click({ force: true });
  }
});
