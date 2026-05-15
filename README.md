# LendSwift — Institutional-Grade Fintech Engineering Platform

LendSwift is a production-ready, editorial-style fintech application engineered to redefine the global loan application journey. Built for institutional reliability, it combines high-fidelity design with complex financial orchestration, featuring real-time underwriting, biometric identity verification, and an 8-step cinematic onboarding flow.

![LendSwift Hero Banner](./public/hero-banner.png)

[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-orange?style=for-the-badge)](https://github.com/pmndrs/zustand)
[![Cypress](https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white)](https://www.cypress.io/)

---

## 💎 1. Design Philosophy: "Editorial Fintech"

LendSwift departs from generic "SaaS dashboards," opting for a high-concept **Editorial Fintech** approach. This philosophy prioritizes the user as an institutional partner, not just a customer.

### Core Visual Pillars:

- **Cinematic Experience**: Every transition is governed by physics-based Framer Motion orchestrations (spring stiffness: 100, damping: 30) to create a "living" interface.
- **Premium Typography**:
  - _Serif_: **Instrument Serif** for display titles, conveying authority and history.
  - _Sans_: **Inter** for high-density data, ensuring readability.
  - _Mono_: **Space Mono** for financial identifiers (PAN, Aadhaar, IDs), emphasizing technical precision.
- **Glassmorphism & Depth**: Subtle transparency and backdrop blurs (`backdrop-blur-xl`) create a sense of institutional security and modern layering.
- **High-Density Clarity**: Complex financial data is structured into intuitive, high-contrast layouts.

---

## 🚀 2. Quick Start

Get LendSwift running locally in less than 2 minutes.

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**

### Installation Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-repo/lendswift.git
   cd lendswift
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Launch Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`.

4. **Run Tests**

   ```bash
   # Open Cypress Dashboard
   npm run cypress:open

   # Run Headless Tests
   npm run cypress:run
   ```

---

## 📱 3. Responsive Engineering Dossier (320px - 1920px)

LendSwift is engineered with a **Viewport-Specific UI Strategy**, ensuring that the high-fidelity aesthetic is never compromised regardless of device form factor.

### 3.1 The Breakpoint Matrix:

- **320px - 414px (Ultra-Mobile)**: Vertical stacking, fluid scaling of `text-editorial` from `4xl` to `text-2xl`, and expanded touch targets (min 56px).
- **768px (Tablet)**: Side-by-side layouts for summary sidebars, compact icon-based wizard indicators.
- **1024px - 1440px (Desktop)**: Full dual-pane orchestration with a 12-column institutional grid.
- **1920px+ (Ultra-Wide)**: Content-centering with `max-w-7xl` containers to maintain optimal line-length readability.

---

## 🧠 4. Systems Architecture

### 4.1 State Orchestration (Zustand)

We utilize **Zustand** with the `persist` middleware for zero-boilerplate, high-performance state management.

- **Atomic Updates**: State is segmented by section to prevent global re-renders.
- **Session Recovery**: LocalStorage persistence allows for instant "Resume Application" capability.

### 4.2 Form Layer (React Hook Form & Zod)

- **React Hook Form**: Handles complex input validation using uncontrolled inputs for maximum performance.
- **Zod**: Our primary source of truth for statutory data integrity. Features strict pattern matching for PAN/Aadhaar and cross-field dependencies.

### 4.3 Underwriting Engine

The `useUnderwriting` hook calculates real-time **Debt-to-Income (DTI)** ratios and **Confidence Scores** based on user inputs, providing immediate eligibility feedback.

---

## 📂 5. Project Structure

```text
src/
├── components/       # Atomic UI elements (Buttons, Inputs, Cards)
├── forms/            # The 8 core wizard steps (KYC, Employment, etc.)
├── hooks/            # Business logic (Underwriting, AutoSave, A11y)
├── pages/            # Route containers (Wizard, Landing, Success)
├── schemas/          # Zod validation schemas for every form step
├── store/            # Zustand state engine & persistence logic
├── styles/           # Global design tokens & Tailwind extensions
├── utils/            # Formatting, encryption, and math helpers
└── tests/            # Component and integration tests
```

---

## 🛠️ 6. Development Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Generates the production-ready bundle.
- `npm run lint`: Runs ESLint to check for code quality and accessibility violations.
- `npm run lint:fix`: Automatically fixes linting issues where possible.
- `npm run format`: Formats code using Prettier.
- `npm run cypress:open`: Launches the interactive Cypress test runner.
- `npm run cypress:run`: Executes E2E tests in headless mode.

---

## 🛡️ 7. E3 QA Stress Test Protocol Compliance

LendSwift is validated against the **E3.4 Institutional Stress Test Protocol**, ensuring zero-error performance under edge-case scenarios:

- **PAN Entity Validation**: Strict 4th-character validation (`P`, `C`, `H`, `F`, `A`, `T`, `B`, `L`, `J`, `G`) with entity-specific error messaging.
- **DOB Age Gating**: Hardened 21-year threshold logic (accepts exactly 21 years today, rejects 20y 364d).
- **Dynamic Thresholding**: Step 6 (Co-Applicant) triggers strictly on amounts **exceeding** ₹5,00,000 for Personal Loans.
- **Structural Integrity**: Hybrid validation on hydration prevents "Corrupted State" false positives while maintaining strict data schemas for submission.

---

## 🧪 8. Quality & Compliance

- **Accessibility**: WCAG 2.1 AA compliance verified via `eslint-plugin-jsx-a11y`.
- **E2E Testing**: Full coverage for the 8-step journey via Cypress.
- **Step Guards**: Anti-tampering logic prevents deep-linking into steps without satisfying prerequisite data.
- **Statutory Security**: Simulated AES-256 encryption and biometric face-matching protocols.

---

## 📄 9. License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Engineered with precision for the next generation of global fintech.</p>
  <p><strong>Zetheta Algorithms Private Limited | Institutional Fintech Engineering Division</strong></p>
</div>

![LendSwift Footer Banner](./public/footer-banner.png)
