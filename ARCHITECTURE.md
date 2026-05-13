# LendSwift Institutional Engineering Architecture

This document provides a deep-dive technical analysis of the architectural patterns, data structures, and engineering workflows powering the LendSwift platform.

---

## 1. Wizard Orchestration & Routing

LendSwift utilizes a **Linear State Wizard** pattern, architected for high-density data capture while maintaining 60FPS UI performance.

### 1.1 Route-Based State
Unlike traditional wizards that store "activeStep" solely in local component state, LendSwift syncs the active step with the URL via `react-router-dom` (`/apply/step/:id`).
- **Deep Linking**: Allows the application to be bookmarked and resumed at a specific point in the funnel.
- **State Hydration**: On mount, the `LoanWizard` component cross-references the URL `stepId` with the Zustand `currentStep` to ensure the user is not jumping ahead of validation boundaries.

### 1.2 Transition Orchestration
We utilize `AnimatePresence` from **Framer Motion** to handle step transitions. Each step is wrapped in a `motion.div` with an `exit` animation, ensuring that "outgoing" data doesn't just disappear, but slides out to make room for the new section, maintaining the "Editorial" feel.

---

## 2. The Schema Factory (Zod)

The validation layer is architected as a modular **Schema Factory**.

### 2.1 Atomic Step Schemas
Every step is governed by a standalone Zod object. This modularity prevents the "Giant Schema" bottleneck where a small change in Step 1 requires re-testing the entire validation tree.
- **Inference**: TypeScript types are automatically inferred from these schemas (`z.infer<typeof schema>`), ensuring that our `formData` structure in the store always matches the validation requirements.

### 2.2 Cross-Step Dependencies
Complex financial rules often depend on data from previous steps. We handle this through **Dynamic Refinements**.
- *Example*: If Step 1 (`loanSelection`) specifies a "Home Loan," Step 6 (`coApplicant`) schema is dynamically adjusted to make the co-applicant fields mandatory, as institutional home loans require joint liability.

---

## 3. High-Performance Form Engineering (React Hook Form)

To handle hundreds of inputs, we've implemented a **Non-Blocking Form Architecture**.

### 3.1 Uncontrolled Input Pattern
By using `register()` or `Controller` with `shouldUnregister: false`, we maintain a lean React tree. Fields only broadcast their value to the store upon validation success or specific blur events, preventing the "Typing Lag" typical of state-per-keystroke forms.

### 3.2 Error Mapping
Our architecture maps Zod's nested error objects directly to UI fieldsets. We've implemented a custom `ErrorMessage` component (simulated via local logic) that handles ARIA-live announcements, ensuring that validation failures are accessible to screen readers.

---

## 4. State Persistence & Auto-Save Lifecycle

Resiliency is a core institutional requirement.

### 4.1 The Persistence Middleware
Zustand's `persist` middleware is configured with a custom `storage` engine (`localStorage`).
- **Selective Persistence**: We selectively persist the `formData` and `currentStep`, but reset `isResumeModalOpen` on every new session to ensure a clean UX entry point.

### 4.2 useAutoSave.js Logic
The auto-save hook implements a **Comparison-Based Trigger**:
1. **Reference Check**: It stores a `JSON.stringify` snapshot of the form data in a `useRef`.
2. **Interval Check**: Every 30 seconds, it compares the *current* state with the *last-saved* snapshot.
3. **Execution**: If a difference is detected, it triggers the `saveProgress` action, updating the `lastSaved` timestamp in the store.

---

## 5. Security & Identity (KYC Engine)

The KYC module is a "System within a System."

### 5.1 Biometric Match Algorithm
The face-matching logic (simulated) uses a confidence-interval approach. It tracks:
- `isFaceVerified`: A boolean flag for the final gate.
- `faceMatchScore`: A 0-100 float that determines the "Confidence Tier" displayed to the user.

### 5.2 Encryption Simulation
Before data is committed to the Zustand store, sensitive statutory numbers (PAN/Aadhaar) pass through a `maskData` utility that simulates client-side encryption. In a production environment, this would be replaced with an RSA/AES public key encryption layer.

---

## 6. CSS Design System (Tailwind Tokens)

LendSwift uses a curated set of Tailwind tokens to maintain brand consistency:
- **Colors**: 
  - `bg-white`: High-contrast institutional baseline.
  - `text-[#121212]`: Deep onyx for premium readability.
  - `accent-[#0065FF]`: Institutional blue for calls-to-action.
- **Borders**: Standardized `border-[#EEEEEE]` for all card and input containers.
- **Radius**: Large, friendly `rounded-[2.5rem]` containers contrasted with sharp, precise inputs.

---

<div align="center">
  <p><strong>LendSwift | Institutional Engineering Division</strong></p>
  <p>Revision: 2026.05.13 | Lead Architect: Antigravity</p>
</div>
