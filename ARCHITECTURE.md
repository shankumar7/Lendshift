# LendSwift Engineering Architecture

This document outlines the core architectural patterns and technical decisions governing the LendSwift institutional platform.

## 1. Wizard Orchestration Pattern

LendSwift implements a **Linear State Wizard** pattern to handle the high complexity of loan applications. This architecture is chosen over a single-page form to:
- **Reduce Cognitive Load**: Segments ~150 data points into 8 logical phases.
- **Enforce Sequential Validation**: Ensures Step N is valid before proceeding to Step N+1.
- **Dynamic Branching**: Allows the wizard to skip or inject steps (e.g., co-applicant flow) based on previous answers.

### Orchestration Layer
The wizard state is managed globally via `useLoanStore` (Zustand), while the active step is controlled via the URL path (`/apply/step/:id`). This enables:
- **Direct Deep Linking**: Users can return to specific steps.
- **Browser History Support**: Native back/forward navigation within the wizard.

---

## 2. Schema Factory & Validation Strategy

We utilize **Zod** as our primary validation and type-inference engine.

### Step-Level Schemas
Each wizard step has its own isolated schema (e.g., `kycSchema.js`). This isolation allows for:
- **Faster Re-renders**: Validation only runs for the active step.
- **Modular Maintenance**: Changes to KYC requirements don't affect Employment validation logic.

### Cross-Step Dependency Management
Validation dependencies are handled through a **Composite Schema** pattern. In `LoanWizard.jsx`, schemas are dynamically selected based on the `currentStep`, but they can reference global application state from the Zustand store.

Example: The `EmploymentStep` schema adjusts its "Minimum Income" requirement based on the `loanAmount` selected in Step 1.

---

## 3. High-Performance Form Layer (RHF)

LendSwift utilizes **React Hook Form (RHF)** to manage hundreds of inputs with institutional-grade performance.

### Uncontrolled Input Strategy
By defaulting to uncontrolled inputs, we avoid the "Laggy Input" bottleneck common in controlled form libraries like Formik. RHF only re-renders specific components on validation errors, maintaining 60FPS even on lower-end hardware.

### Institutional Integration
RHF is tightly integrated with our Zod schemas via `@hookform/resolvers/zod`, providing:
- **Strict Typing**: Automatic type inference from Zod to form fields.
- **Native Error Handling**: Mapping Zod validation errors to ARIA-compliant UI messages.

---

## 4. Auto-Save & Resiliency Flow

To prevent data loss in mission-critical applications, LendSwift implements a **Debounced Persistence Flow**.

### Lifecycle:
1. **Mutation**: User interacts with a form field.
2. **Local Update**: `updateFormData` updates the global Zustand state.
3. **Debounced Sync**: `useAutoSave.js` monitors the store and triggers `saveProgress` every 3 seconds if changes are detected.
4. **Persistence**: Zustand's `persist` middleware automatically synchronizes the state to `localStorage`.

### Session Recovery:
Upon application initialization, the system checks for a persistent session. If found, a **Resume Application** modal is surfaced, allowing users to restore their exact progress, including uploaded document previews.

---

## 5. Security & Identity (KYC Architecture)

The KYC module is engineered for institutional trust:
- **Facial Biometrics**: Uses a physics-based matching simulation with confidence scoring.
- **Document Encryption**: Simulates AES-256 client-side encryption for all identity assets before store persistence.
- **Compliance Badging**: A real-time `VerificationBadge` system that provides visual feedback for statutory validation states.

---

<div align="center">
  <p><strong>LendSwift | Institutional Engineering Division</strong></p>
</div>
