import { useMemo } from 'react';
import useLoanStore from '../store/useLoanStore';

const useUnderwriting = () => {
  const { formData } = useLoanStore();

  return useMemo(() => {
    const { employment, coApplicant, personalInfo } = formData;

    // 1. Income Metrics
    const primaryIncome = employment.monthlyIncome || 0;
    const secondaryIncome = coApplicant.hasCoApplicant ? coApplicant.monthlyIncome || 0 : 0;
    const totalHouseholdIncome = primaryIncome + secondaryIncome;

    // 2. Liability Metrics
    const primaryEmis = employment.existingEmis || 0;
    const secondaryEmis = coApplicant.hasCoApplicant ? coApplicant.existingEmis || 0 : 0;
    const totalObligations = primaryEmis + secondaryEmis;

    // 3. DTI (Debt-to-Income)
    const dti = totalHouseholdIncome > 0 ? (totalObligations / totalHouseholdIncome) * 100 : 0;

    // 4. Risk Scoring (Simulated Institutional Logic)
    let score = 500; // Base score

    // Income boosts
    if (totalHouseholdIncome > 100000) score += 100;
    if (totalHouseholdIncome > 250000) score += 150;

    // Employment stability
    if (employment.type === 'salaried') score += 50;

    // DTI Penalties
    if (dti > 40) score -= 100;
    if (dti > 60) score -= 200;

    // Identity verification boost
    if (personalInfo.isPanVerified && personalInfo.isAadhaarVerified) score += 100;

    // Co-applicant boost
    if (coApplicant.hasCoApplicant) score += 80;

    // 5. Normalization (300-900)
    const finalScore = Math.min(900, Math.max(300, score));

    // 6. Tiers
    let tier = 'Standard';
    let color = '#FFB300';
    if (finalScore >= 750) {
      tier = 'Premium';
      color = '#2E7D32';
    } else if (finalScore >= 650) {
      tier = 'Preferred';
      color = '#0065FF';
    } else if (finalScore < 500) {
      tier = 'High Risk';
      color = '#D32F2F';
    }

    // 7. Confidence & Processing
    const confidence = Math.round((finalScore / 900) * 100);
    const estTime = finalScore > 700 ? '12-24 Hours' : '48-72 Hours';

    return {
      score: finalScore,
      tier,
      color,
      dti: dti.toFixed(1),
      confidence,
      estTime,
      totalIncome: totalHouseholdIncome,
      totalObligations,
      complianceStatus:
        personalInfo.isPanVerified && personalInfo.isAadhaarVerified ? 'Full' : 'Partial',
    };
  }, [formData]);
};

export default useUnderwriting;
