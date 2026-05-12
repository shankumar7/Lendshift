import { lazy } from 'react';
import {
  User,
  Briefcase,
  DollarSign,
  Home,
  ShieldCheck,
  Upload,
  PenTool,
  CheckSquare,
} from 'lucide-react';

// Lazy load step components for performance
const PersonalInfoStep = lazy(() => import('@/forms/PersonalInfoStep'));
const EmploymentStep = lazy(() => import('@/forms/EmploymentStep'));
const FinancialsStep = lazy(() => import('@/forms/FinancialsStep'));
const LoanPurposeStep = lazy(() => import('@/forms/LoanPurposeStep'));
const CollateralStep = lazy(() => import('@/forms/CollateralStep'));
const DocumentsStep = lazy(() => import('@/forms/DocumentsStep'));
const SignatureStep = lazy(() => import('@/forms/SignatureStep'));
const FinalReviewStep = lazy(() => import('@/forms/FinalReviewStep'));

export const STEP_REGISTRY = [
  {
    id: 'personal',
    title: 'Personal Details',
    description: 'Basic identity and contact information',
    icon: User,
    component: PersonalInfoStep,
  },
  {
    id: 'employment',
    title: 'Employment',
    description: 'Current work and income status',
    icon: Briefcase,
    component: EmploymentStep,
  },
  {
    id: 'financials',
    title: 'Financial Health',
    description: 'Existing liabilities and assets',
    icon: ShieldCheck,
    component: FinancialsStep,
  },
  {
    id: 'purpose',
    title: 'Loan Details',
    description: 'Loan amount and specific requirements',
    icon: DollarSign,
    component: LoanPurposeStep,
  },
  {
    id: 'property',
    title: 'Property/Collateral',
    description: 'Assets used for securing the loan',
    icon: Home,
    component: CollateralStep,
  },
  {
    id: 'documents',
    title: 'Documents',
    description: 'Verification of identity and income',
    icon: Upload,
    component: DocumentsStep,
  },
  {
    id: 'signature',
    title: 'E-Signature',
    description: 'Final agreement and signing',
    icon: PenTool,
    component: SignatureStep,
  },
  {
    id: 'review',
    title: 'Final Review',
    description: 'Review and submit your application',
    icon: CheckSquare,
    component: FinalReviewStep,
  },
];

export const getStepById = (id) => STEP_REGISTRY.find((step) => step.id === id);
export const getStepIndexById = (id) => STEP_REGISTRY.findIndex((step) => step.id === id);
