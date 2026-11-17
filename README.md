# LendSwift — Multi-Step Loan Application

LendSwift is an editorial-style, multi-step loan application built with React. It walks an applicant through an 8-step onboarding flow — loan configuration with a live EMI calculator, identity and KYC verification, address, employment, an optional/mandatory co-applicant, document upload with e-signature, and a final review — with autosave and session recovery along the way.

![LendSwift Hero Banner](./public/hero-banner.png)

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-orange?style=for-the-badge)](https://github.com/pmndrs/zustand)
[![Cypress](https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white)](https://www.cypress.io/)

> **Note:** All verification, OTP, OCR, geo-location and underwriting behaviour is **simulated** on the client. No data leaves the browser and no real KYC or credit checks are performed.

---

## Features

- **8-step guided wizard** synced to the URL (`/apply/step/:id`), with deep-link guards that stop users skipping ahead.
- **Live EMI calculator** with loan-type specific limits (e.g. Home Loans need a 60-month minimum tenure).
- **Strict validation** with Zod + React Hook Form: PAN entity-type checks, Aadhaar format, IFSC lookup, age gating (21+), pincode lookup.
- **Smart step logic** — the Co-Applicant step is skipped for personal loans up to ₹5,00,000, optional above that, and mandatory for home loans.
- **KYC & documents** — simulated PAN/Aadhaar verification, face match, drag-and-drop uploads with client-side image compression and mock OCR.
- **E-signature** captured on a canvas, plus agreement consent.
- **Autosave & session recovery** — progress persists in `localStorage` and a "Resume Application" modal restores it.
- **Review & submit** with a simulated submission pipeline, tracking timeline and downloadable summary.
- **Responsive & accessible** — verified from phone to desktop, with ARIA live announcements for step changes.

## Design

An "Editorial Fintech" look: _Instrument Serif_ for display, _Inter_ for UI text and _Space Mono_ for identifiers, with restrained glassmorphism and Framer Motion transitions.

## Tech stack

React 19 · Vite · React Router 7 · Zustand (persist) · React Hook Form · Zod · Tailwind CSS · Framer Motion · react-dropzone · react-signature-canvas · react-hot-toast · Cypress · ESLint + Prettier

## Quick start

Prerequisites: Node.js 18+ and npm.

```bash
git clone https://github.com/shankumar7/multi-step-loan-application.git
cd multi-step-loan-application
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Scripts

| Command                                | Description                                    |
| -------------------------------------- | ---------------------------------------------- |
| `npm run dev`                          | Start the Vite dev server                      |
| `npm run build`                        | Create a production build in `dist`            |
| `npm run preview`                      | Preview the production build                   |
| `npm run lint` / `npm run lint:fix`    | Lint the codebase                              |
| `npm run format`                       | Format with Prettier                           |
| `npm run cypress:open` / `cypress:run` | Run the E2E tests (dev server must be running) |

## Try it

A full happy path uses any values that pass validation, e.g. mobile `9876543210` (any 6-digit OTP), PAN `ABCPD1234F`, Aadhaar `123456789012`, IFSC `SBIN0001234`, pincode `400001`, and any small image for the document uploads.

## Project structure

```text
src/
├── components/   # Nav, Footer, Logo, EMI panel, form fields, modals
├── forms/        # The 8 wizard steps (loan, personal, KYC, address, employment, co-applicant, documents, review)
├── hooks/        # useAutoSave, useAccessibility
├── pages/        # Landing, LoanWizard, Success and static pages
├── schemas/      # Zod schemas per step
├── store/        # Zustand store with persistence
├── styles/       # Global styles and design tokens
└── utils/        # Small helpers
cypress/          # E2E specs and custom commands
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a deeper look at routing, state and validation.

## License

Released under the [MIT License](LICENSE).
