# LendSwift — Premium Fintech Loan Platform

LendSwift is a production-grade, editorial-style fintech platform designed to provide a seamless and premium loan application experience. Built with a focus on visual excellence and technical robustness, it features a comprehensive multi-step wizard, real-time financial feedback, and intelligent state persistence.

![LendSwift Banner](https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200)

## 💎 Core Features

- **8-Step Editorial Wizard**: A meticulously crafted multi-step application flow designed with refined grid layouts, smooth transitions, and high-density logic.
- **Real-time EMI Panel**: Dynamic financial calculator that provides instant feedback on monthly installments, interest costs, and principal ratios as users adjust their loan parameters.
- **Intelligent Auto-Save**: Seamless state persistence using Zustand and local storage, ensuring all data and verification statuses are preserved.
- **Data Synchronization**: Intelligently pre-fills information (e.g., Occupation) across steps to minimize friction and improve the onboarding experience.
- **Zero-Friction Design**: Premium UI/UX featuring uniform grid arrangements, glassmorphism, and fluid animations (Framer Motion).
- **Production-Ready**: 100% compliant with strict ESLint and React Compiler rules, ensuring high performance and maintainability.

## 🚀 Tech Stack

- **Framework**: [React 19](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🛠️ Project Structure

```text
src/
├── components/     # Reusable UI components (EMI Panel, Logo, Modals)
├── forms/          # Wizard step implementations
├── hooks/          # Custom hooks (useAutoSave, etc.)
├── pages/          # Main application screens (Landing, Wizard, Success)
├── schemas/        # Zod validation schemas
├── store/          # Zustand state definitions
└── styles/         # Global styles and Tailwind configurations
```

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the local development server:
```bash
npm run dev
```

### Quality Assurance
Run the production linting check:
```bash
npm run lint
```

Format the codebase:
```bash
npm run format
```

## 🎨 Design Philosophy
LendSwift follows an **Editorial Fintech** philosophy. We move away from generic "dashboard" aesthetics towards a more premium, magazine-like experience. This involves:
- **Bold Typography**: Using high-contrast serif and sans-serif pairings.
- **Fluidity**: Every interaction is backed by subtle, non-intrusive animations.
- **Clarity**: High-density information is presented in a way that minimizes cognitive load.

---

Built with precision by the LendSwift Team.
