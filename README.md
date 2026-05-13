# LendSwift — Institutional-Grade Fintech Onboarding

LendSwift is a production-grade, editorial-style fintech platform engineered to redefine the loan application experience. It combines high-fidelity design with institutional-grade technical standards, featuring a comprehensive multi-step wizard, biometric identity simulations, and resilient state persistence.

![LendSwift Banner](https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200)

## 💎 Design Philosophy: "Editorial Fintech"

LendSwift departs from traditional "dashboard" aesthetics, opting for an **Editorial Fintech** approach. This philosophy prioritizes:
- **Premium Typography**: Sophisticated serif and sans-serif pairings for a magazine-like read.
- **Glassmorphism & Fluidity**: Subtle transparency effects and Framer Motion orchestrations for a "living" interface.
- **High-Density Clarity**: Complex financial data structured into intuitive, high-contrast layouts that minimize cognitive load.

---

## 🚀 Key Features

### 🏦 Institutional Verification Suite
- **Biometric Face Match**: Real-time facial identity validation simulation with animated scanning and confidence scoring.
- **Statutory Identity Engine**: Robust PAN and Aadhaar verification simulation with automatic format enforcement and input masking.
- **Security Verification (OTP)**: Enhanced 6-digit OTP UI with persistent resend logic and dynamic countdown timers.

### 📍 Intelligent Address Handling
- **Smart PIN Lookup**: Indian PIN-code auto-detection that instantaneously populates city and state data.
- **Geo-Spatial Verification**: Simulated GPS-based location validation to ensure residency accuracy.
- **Conditional Logic**: Adaptive form engineering that handles rented properties, landlord details, and duration-based residency proofs.

### 💾 Engineering Excellence
- **Real-Time Auto-Save**: Debounced synchronization between the form state and a persistent global store, ensuring zero data loss on refreshes.
- **Resume Application Flow**: An intelligent entry system that detects existing progress and offers a seamless "Pick up where you left off" experience.
- **State Persistence**: Powered by Zustand with local storage middleware for resilient cross-session performance.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Core UI framework with Concurrent Mode support. |
| **Zustand** | Centralized state management with persistent storage. |
| **Framer Motion** | Physics-based animations and layout transitions. |
| **Tailwind CSS** | Utility-first styling for high-fidelity custom design systems. |
| **Zod** | Schema-first validation ensuring 100% data integrity. |
| **React Hook Form** | High-performance, uncontrolled form management. |
| **Lucide React** | Consistent, high-quality iconography. |

---

## 🏁 Development Setup

### 📦 Prerequisites
- **Node.js**: v18.0.0+
- **npm**: v9.0.0+

### 🛠️ Installation & Launch
1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start development server:**
   ```bash
   npm run dev
   ```

### 🧹 Quality Standards
Maintain the production-grade quality of the codebase:
- **Linting Check**: `npm run lint`
- **Prettier Format**: `npm run format`

---

## 📂 Architecture

```text
src/
├── forms/        # Feature-rich wizard steps (Loan, Personal, KYC, Address)
├── store/        # Zustand store with persistent middleware
├── hooks/        # Custom logic (useAutoSave, useVerify, etc.)
├── schemas/      # Zod validation rules per step
├── layouts/      # High-level UI shells and navigation
├── components/   # Atomic & Molecular UI elements (Logo, EMI Panel, Modals)
└── styles/       # Design system tokens and global CSS utilities
```

---

<div align="center">
  <p>Built with precision for the next generation of digital banking.</p>
  <p><strong>LendSwift Engineering Team</strong></p>
</div>
