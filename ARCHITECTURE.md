# LendSwift Institutional Engineering Architecture

This document provides a deep-dive technical analysis of the architectural patterns, data structures, and engineering workflows powering the LendSwift platform.

---

## 1. Wizard Orchestration & Routing

LendSwift utilizes a **Linear State Wizard** pattern, architected for high-density data capture while maintaining 60FPS UI performance.

### 1.1 Route-Based State

Unlike traditional wizards that store "activeStep" solely in local component state, LendSwift syncs the active step with the URL via `react-router-dom` (`/apply/step/:id`).

- **Deep Linking**: Allows the application to be bookmarked and resumed at a specific point in the funnel.
- **State Hydration**: On mount, the `LoanWizard` component cross-references the URL `stepId` with the Zustand `currentStep` to ensure the user is not jumping ahead of validation boundaries.
- **Anti-Tampering Guards**: Implements `isStep1Submitted` as a persistent gating mechanism. This ensures that users cannot bypass the initial Loan Selection phase via direct URL navigation (`/apply/step/8`), enforcing the sequential integrity of the financial funnel.

---

## 2. Responsive Grid System & Fluidity

LendSwift's responsive architecture is built on a **Fluid Breakpoint Logic** that goes beyond standard media queries.

### 2.1 The Seven-Tier Breakpoint Strategy

We target seven distinct viewports (320px, 375px, 414px, 768px, 1024px, 1440px, 1920px) using a **Mobile-First Progressive Enhancement** approach.

- **320px - 414px**: Uses a single-column layout with fluid typography (`calc` based) to prevent header clipping.
- **768px (Tablet)**: Transitions to a "Split-Pane" layout where the summary sidebar becomes a bottom-sheet on vertical tablets or a side-column on landscape.
- **1024px - 1920px**: Implements a fixed-width content gutter with floating institutional sidebars to maintain line-length readability (optimal 65-75 characters per line).

### 2.2 Layout Persistence

The `LoanWizard` uses a flexbox-based responsive wrapper that dynamically adjusts the `flex-direction` from `column` to `row` at the `lg` (1024px) breakpoint, ensuring that the navigation context is always visible.

---

## 3. The Underwriting Engine (Logic Layer)

The underwriting metrics are computed inside the Co-Applicant and Review steps (`CoApplicantStep.jsx`, `ReviewStep.jsx`) as memoized calculations over the Zustand store.

### 3.1 Real-time Debt-to-Income (DTI) Calculation

As the user enters income in Step 5 and Step 6, the engine performs real-time calculations:

- `JointDTI = (PrimaryEMIs + CoApplicantEMIs) / (PrimaryIncome + CoApplicantIncome)`
- **Eligibility Boost**: The system calculates the delta between individual and joint DTI to display an "Eligibility Boost" percentage, encouraging joint applications.

### 3.2 Confidence Scoring

A proprietary heuristic (simulated) calculates a **Confidence Score** (0-98%) based on:

1. Identity Verification status (KYC matches).
2. DTI Ratio (lower = higher confidence).
3. Employment Stability (years in profession).

---

## 4. State Persistence & Auto-Save Lifecycle

Resiliency is a core institutional requirement.

### 4.1 The Persistence Middleware

Zustand's `persist` middleware is configured with a custom `storage` engine (`localStorage`).

- **Selective Persistence**: We selectively persist the `formData` and `currentStep`.

### 4.2 useAutoSave.js Logic

The auto-save hook implements a **Comparison-Based Trigger**:

1. **Reference Check**: Stores a `JSON.stringify` snapshot in a `useRef`.
2. **Interval Check**: Every 30 seconds, it compares the _current_ state with the _last-saved_ snapshot.
3. **Execution**: If a difference is detected, it triggers the `saveProgress` action.

### 4.3 Structural Sanity Checks (Hydration Layer)

To prevent session corruption during store hydration (Zustand `persist`), we implement a **Structural Sanity Check**:

- Instead of strict schema validation (which fails on partially filled forms), we check for the **existence and shape** of core data structures (`loanSelection`, `personalInfo`).
- If a catastrophic mismatch is detected (e.g. key objects missing), the system triggers a **"Corrupted State"** flag, prompting the user to reset to safety rather than crashing the UI.

---

## 5. Security & Identity (KYC Engine)

The KYC module is a "System within a System."

### 5.1 Biometric Match Algorithm

The face-matching logic (simulated) uses a confidence-interval approach. It tracks `isFaceVerified` and `faceMatchScore` to gate the final submission.

---

## 6. Accessibility & Focus Management

LendSwift implements a **Global Focus Orchestration** system.

### 6.1 Section Announcements

The `useAccessibility` hook utilizes `aria-live="polite"` regions to announce step transitions. When a user moves from Step 2 to Step 3, the screen reader automatically announces the new section title, preventing "context loss."

### 6.2 Focus Trapping

Modals (Resume Application) utilize focus trapping to ensure that keyboard users cannot navigate "under" the overlay, maintaining institutional safety standards.

---

<div align="center">
  <p><strong>LendSwift</strong> · Architecture notes</p>
</div>
