# LendSwift

A multi-step loan application I built with React. You pick a loan, see the EMI update live, and then go through 8 steps (personal info, KYC, address, employment, co-applicant, documents, review) until you hit submit. Progress is saved as you go, so you can close the tab and pick up where you left off.

I wanted to see how far I could take a "boring" long form: make it feel nice to use, validate things properly, and not let people skip steps by editing the URL.

![LendSwift hero](./public/hero-banner.png)

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-orange?style=for-the-badge)](https://github.com/pmndrs/zustand)
[![Cypress](https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white)](https://www.cypress.io/)

> **Heads up:** this is a front-end demo. Everything that looks like a verification (OTP, PAN/Aadhaar check, face match, geo check, document OCR, IFSC lookup, the final submission) is **faked on the client** with timers and sample data. Nothing is sent to a server and no real KYC or credit check happens. Please don't enter real personal details.

## Contents

- [What it does](#what-it-does)
- [The 8 steps](#the-8-steps)
- [Loan rules](#loan-rules)
- [Validation rules](#validation-rules)
- [Running it locally](#running-it-locally)
- [Test data for a quick run-through](#test-data-for-a-quick-run-through)
- [Tech stack](#tech-stack)
- [How it's put together](#how-its-put-together)
- [Project structure](#project-structure)
- [Scripts](#scripts)
- [Testing](#testing)
- [Things I'd improve next](#things-id-improve-next)
- [License](#license)

## What it does

- **Live EMI calculator.** Move the amount or tenure sliders and the monthly EMI, total interest and total repayment update straight away.
- **Step-by-step wizard tied to the URL.** Each step lives at `/apply/step/1` … `/apply/step/8`, so refresh and the back button behave.
- **Can't skip ahead.** If you open `/apply/step/8` directly without finishing step 1, you get sent back to step 1.
- **Autosave + resume.** Everything is stored in `localStorage`. Come back later and a "Resume Application" popup offers to continue or start fresh.
- **Smart co-applicant step.** It only shows up when the loan needs it (see [Loan rules](#loan-rules)).
- **Document uploads.** Drag and drop or click, images get compressed in the browser, and each file goes through a fake "scanning" step.
- **E-signature.** Draw your signature on a canvas, tick the agreement, done.
- **Review and submit.** See a summary of everything, accept the declaration, and watch a fake submission pipeline run. After that you get an application ID, a tracking timeline and a downloadable text summary.
- **Responsive.** Checked from phone width up to a normal desktop.
- **Accessibility bits.** Step changes are announced to screen readers through an `aria-live` region, the resume modal handles Escape, and form fields have proper labels. Pressing Enter in an input moves you forward.
- **Safety nets.** If the saved data looks broken, the app tells you and offers to reset. If you edit the application in another tab, you get a warning to reload.

## The 8 steps

| #   | Step                 | What happens there                                                                                                                                                                                                                        |
| --- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Loan Selection**   | Choose Personal / Home / Business, set amount and tenure with sliders, pick a purpose, employment type and monthly income. EMI panel updates live.                                                                                        |
| 2   | **Personal Info**    | Name, date of birth, gender, marital status, mobile (with a fake OTP), email, PAN and Aadhaar (each with a verify button), occupation, education, annual income.                                                                          |
| 3   | **KYC Verification** | Verify PAN and Aadhaar again, choose a secondary ID (e.g. passport) and its number, upload PAN, Aadhaar and the secondary ID, then run a simulated selfie / face match.                                                                   |
| 4   | **Address**          | Current address with PIN lookup that fills city and state, residence type, how long you've lived there, an optional previous address, a permanent address (or "same as current"), a simulated location check and an address proof upload. |
| 5   | **Employment**       | Pick Salaried, Self-employed, Business, Freelancer or Retired and the form changes to match. Also bank name via IFSC lookup, account type and monthly obligations.                                                                        |
| 6   | **Co-Applicant**     | Relationship, identity, mobile / PAN / Aadhaar checks, income and EMIs, signature and consent. A side panel shows the combined income, joint debt-to-income ratio and an approval confidence.                                             |
| 7   | **Documents**        | Upload whatever is still missing (bank statements, plus income proof, GST, ITR or property papers depending on the loan), then switch to the e-signature tab to sign and accept the loan agreement.                                       |
| 8   | **Review**           | Summary of every section with edit shortcuts, a final declaration checkbox and the submit button.                                                                                                                                         |

## Loan rules

|                                          | Personal                              | Home            | Business            |
| ---------------------------------------- | ------------------------------------- | --------------- | ------------------- |
| Amount                                   | ₹50,000 – ₹25L                        | ₹5L – ₹5Cr      | ₹1L – ₹75L          |
| Tenure                                   | 6 – 60 months                         | 60 – 360 months | 6 – 120 months      |
| Sample interest rate (for the EMI maths) | 10.5%                                 | 8.5%            | 12%                 |
| Co-applicant                             | Skipped up to ₹5L, optional above ₹5L | Always required | Required above ₹20L |

Minimum monthly income across all loans is ₹10,000. The interest rates are made up for the demo and are not real offers.

## Validation rules

Forms use React Hook Form with Zod schemas (one per step in `src/schemas`). The rules I spent the most time on:

- **PAN:** 10 characters in the `ABCDE1234F` format, and the 4th character must be a valid holder type (P for individual, C for company, and so on).
- **Aadhaar:** exactly 12 digits.
- **Mobile:** 10 digits starting with 6–9.
- **Age:** applicant must be at least 21. The check is date-accurate, so someone who turns 21 today passes and someone who turns 21 tomorrow doesn't.
- **Pincode:** 6 digits. A few real ones (110001, 400001, 560001, 600001, 700001, 500001) fill in the proper city and state; any other pincode fills in placeholder text.
- **IFSC:** 11 characters. The lookup is faked and always returns the same sample bank.
- **Uploads:** images and PDFs, max 5 MB each.
- **Step gating:** the Continue button stays disabled until the required items for that step (verifications, uploads, signature and so on) are done.

## Running it locally

You need Node.js 18 or newer and npm.

```bash
git clone https://github.com/shankumar7/multi-step-loan-application.git
cd multi-step-loan-application
npm install
npm run dev
```

Then open http://localhost:5173.

To make a production build and preview it:

```bash
npm run build
npm run preview
```

There's a small `.npmrc` with `legacy-peer-deps=true`. It's there because `eslint-config-airbnb` hasn't caught up with the newest React hooks plugin's peer dependency range, and without it `npm install` fails.

Google Fonts (Instrument Serif, Inter, Space Mono) are loaded from the internet, so you'll see fallback fonts if you're offline.

## Test data for a quick run-through

Any value that passes the validation works. This set gets you through the whole flow:

| Field                | Value                                                                           |
| -------------------- | ------------------------------------------------------------------------------- |
| Mobile               | `9876543210` (any 6-digit code works as the OTP)                                |
| PAN                  | `ABCPD1234F`                                                                    |
| Aadhaar              | `123456789012`                                                                  |
| Date of birth        | anything that makes you 21 or older                                             |
| ID number (passport) | `Z1234567`                                                                      |
| Pincode              | `400001`                                                                        |
| IFSC                 | `SBIN0001234`                                                                   |
| Uploads              | any small `.jpg`, `.png` or `.pdf` (there's one in `cypress/fixtures/test.jpg`) |

Quick ways to see the different paths:

- **Personal loan up to ₹5,00,000:** step 6 is skipped and you go from Employment straight to Documents.
- **Personal loan above ₹5,00,000:** step 6 appears but you can skip it.
- **Home loan:** set the tenure to 60 months or more and step 6 is mandatory.

## Tech stack

| Area                  | What I used                                           |
| --------------------- | ----------------------------------------------------- |
| UI                    | React 19, Vite                                        |
| Routing               | React Router 7                                        |
| State                 | Zustand with the `persist` middleware                 |
| Forms and validation  | React Hook Form, Zod, `@hookform/resolvers`           |
| Styling               | Tailwind CSS 3, `clsx`, `tailwind-merge`              |
| Animation             | Framer Motion                                         |
| Icons                 | lucide-react                                          |
| Uploads and signature | react-dropzone, react-signature-canvas                |
| Toasts                | react-hot-toast                                       |
| Testing               | Cypress                                               |
| Code quality          | ESLint (Airbnb + jsx-a11y + react-hooks) and Prettier |

### Design

I went for an editorial look rather than a typical dashboard: serif display headings (Instrument Serif), Inter for the UI text, and Space Mono for things like PAN and Aadhaar numbers. Cards are rounded, backgrounds are soft grays, and the transitions are spring-based with Framer Motion.

## How it's put together

- **One store for everything.** `src/store/useLoanStore.js` holds the whole application (`formData`), the current step and a few flags. It's persisted to `localStorage` under the key `lendswift-loan-app`. The empty application is built by a single `createInitialFormData()` function, which is also what "reset" uses.
- **Each step owns its form.** Steps use their own React Hook Form instance with a Zod schema. Valid data is written to the store when you continue, and some steps (like co-applicant and documents) also sync to the store as you type so the Continue button can react.
- **The wizard shell.** `src/pages/LoanWizard.jsx` renders the sidebar, the progress bar, and the current step. The bottom Continue button simply clicks a hidden submit button inside the current form, which is how every step gets the same navigation without duplicating logic.
- **Dynamic steps.** The list of visible steps is computed from the loan type and amount, which is how the co-applicant step appears or disappears.
- **Autosave.** `useAutoSave` checks every 30 seconds whether the data changed and stamps the "Saved" time you see in the header.
- **Resume flow.** If a saved application exists when you visit `/apply`, a modal lets you continue or start fresh.
- **Fake backend.** Anything that would normally be an API call (OTP, PAN/Aadhaar, face match, OCR, geo check, submission) is a `setTimeout`. They're easy to find and swap for real calls later.

There's more detail in [ARCHITECTURE.md](./ARCHITECTURE.md).

## Project structure

```text
.
├── cypress/
│   ├── e2e/                 # dashboard.cy.js, onboarding.cy.js
│   ├── fixtures/            # test.jpg used for uploads
│   └── support/             # custom commands that fill each step
├── public/                  # favicon and README banners
└── src/
    ├── components/          # Nav, Footer, Logo, EMIPanel, FormField, FileUploader, ResumeModal, Button
    ├── forms/               # the 8 wizard steps
    ├── hooks/               # useAutoSave, useAccessibility
    ├── pages/               # LandingPage, LoanWizard, SuccessPage, StaticPage
    ├── schemas/             # Zod schemas, one per step plus a global one
    ├── store/               # useLoanStore (Zustand + persist)
    ├── styles/              # globals.css (Tailwind layers and design tokens)
    └── utils/               # cn() class helper
```

Besides the wizard, the app has a landing page and a handful of simple content pages (Personal, Enterprise, Mortgage, Markets, About, Vision, Careers, Ethics, Institutional, Support, Our Methods).

## Scripts

| Command                | What it does                       |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Start the dev server on port 5173  |
| `npm run build`        | Production build into `dist/`      |
| `npm run preview`      | Serve the production build locally |
| `npm run lint`         | Run ESLint                         |
| `npm run lint:fix`     | Run ESLint and fix what it can     |
| `npm run format`       | Format everything with Prettier    |
| `npm run cypress:open` | Open the Cypress runner            |
| `npm run cypress:run`  | Run Cypress headless               |

## Testing

End-to-end tests are written with Cypress and live in `cypress/e2e`. They need the dev server running first.

```bash
# terminal 1
npm run dev

# terminal 2
npm run cypress:run
```

What they cover:

- The landing page, navigation and footer.
- A full personal-loan flow.
- The home-loan flow and its mandatory co-applicant step.
- Autosave and resume after a reload.
- Keyboard navigation.
- The deep-link guard (opening step 8 directly redirects to step 1).

The helper commands in `cypress/support/commands.js` (`fillLoanSelection`, `fillPersonalInfo`, `completeKYC`, `fillAddress`, `fillEmployment`, `handleCoApplicant`) fill each step and are reused across tests.

## Things I'd improve next

- Replace the fake `setTimeout` services with a real backend.
- Code-split the bundle (the main chunk is a bit over 800 KB right now).
- Store uploaded documents properly instead of only keeping their metadata in local storage.
- More unit tests for the Zod schemas.
- Dark mode.

## License

MIT, see [LICENSE](LICENSE).
