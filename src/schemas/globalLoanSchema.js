import { z } from 'zod';
import loanSelectionSchema from './loanSelectionSchema';
import personalInfoSchema from './personalInfoSchema';
import kycSchema from './kycSchema';
import addressSchema from './addressSchema';
import employmentSchema from './employmentSchema';
import coApplicantSchema from './coApplicantSchema';
import documentSchema from './documentSchema';

// The Global Orchestration Schema
const globalLoanSchema = z
  .object({
    loanSelection: loanSelectionSchema,
    personalInfo: personalInfoSchema,
    kyc: kycSchema,
    address: addressSchema,
    employment: employmentSchema,
    coApplicant: coApplicantSchema,
    documents: documentSchema,
  })
  .refine(
    (data) => {
      // Rule 1: Home Loan always requires co-applicant
      if (data.loanSelection.loanType === 'home' && !data.coApplicant.hasCoApplicant) {
        return false;
      }
      return true;
    },
    {
      message: 'Home loans require a mandatory co-applicant for joint liability.',
      path: ['coApplicant', 'hasCoApplicant'],
    }
  )
  .refine(
    (data) => {
      // Rule 2: Business Loan requires GST registration check
      if (data.loanSelection.loanType === 'business' && data.employment.type === 'business') {
        if (!data.employment.isGstRegistered) return false;
      }
      return true;
    },
    {
      message: 'Institutional business loans require a valid GST registration.',
      path: ['employment', 'isGstRegistered'],
    }
  )
  .refine(
    (data) => {
      // Rule 3: Loan Amount vs Income (DTI threshold)
      const monthlyIncome = data.employment.monthlyIncome || 0;
      const loanAmount = data.loanSelection.amount || 0;
      const tenure = data.loanSelection.tenure || 12;
      const estEmi = (loanAmount / tenure) * 1.1; // Simulated EMI with interest

      if (monthlyIncome > 0 && estEmi > monthlyIncome * 0.6) {
        return false;
      }
      return true;
    },
    {
      message: 'Requested loan amount exceeds the safe debt-to-income ratio for your profile.',
      path: ['loanSelection', 'amount'],
    }
  )
  .refine(
    (data) => {
      // Rule 4: Identity Completion
      if (data.personalInfo.isPanVerified && !data.kyc.isPanVerified) {
        return false;
      }
      return true;
    },
    {
      message: 'Cross-step identity mismatch detected between personal and KYC data.',
      path: ['kyc', 'isPanVerified'],
    }
  );

export default globalLoanSchema;
