
import { ProcessInputs, AutomationCosts, CalculationResults } from '../types';

export const calculateROI = (inputs: ProcessInputs, costs: AutomationCosts): CalculationResults => {
  // 1. Current State Calculations
  const annualVolume = inputs.volumePerMonth * 12;
  const currentTotalHours = (annualVolume * inputs.timePerTransactionMinutes) / 60;
  
  // Cost of rework due to errors
  const errorTransactions = annualVolume * (inputs.errorRatePercent / 100);
  const reworkHours = (errorTransactions * inputs.reworkTimeMinutes) / 60;
  
  const totalCurrentHoursAnnually = currentTotalHours + reworkHours;
  const currentAnnualCost = totalCurrentHoursAnnually * inputs.fteHourlyCost;
  const errorCostAnnual = reworkHours * inputs.fteHourlyCost;

  // 2. Future State Calculations (Automation)
  // Assume automated transactions take 0 human time, but we keep the non-automated part
  const automatedVolume = annualVolume * (costs.estimatedAutomationPercentage / 100);
  const manualVolume = annualVolume - automatedVolume;
  
  // Remaining manual work
  const futureManualHours = (manualVolume * inputs.timePerTransactionMinutes) / 60;
  // Assume errors are virtually eliminated in the automated portion, strictly manual rework remains
  const futureErrorTransactions = manualVolume * (inputs.errorRatePercent / 100);
  const futureReworkHours = (futureErrorTransactions * inputs.reworkTimeMinutes) / 60;

  const totalFutureHumanHours = futureManualHours + futureReworkHours;
  const futureHumanCost = totalFutureHumanHours * inputs.fteHourlyCost;
  
  const futureAnnualTotalCost = futureHumanCost + costs.annualLicenseCost + costs.annualMaintenanceCost;

  // 3. Savings & ROI
  const grossSavingsAnnual = currentAnnualCost - futureAnnualTotalCost;
  
  // Year 1 Net Savings (Gross Savings - One-time Implementation)
  const netSavingsYear1 = grossSavingsAnnual - costs.implementationCost;
  
  // ROI Year 1 logic
  const totalInvestmentYear1 = costs.implementationCost + futureAnnualTotalCost;
  const roiYear1 = ((currentAnnualCost - totalInvestmentYear1) / totalInvestmentYear1) * 100;

  // 3 Year Outlook (approximate)
  const netSavingsYear3 = (grossSavingsAnnual * 3) - costs.implementationCost;

  // 4. Payback Period & Monthly Cashflow
  const monthlyGrossSavings = grossSavingsAnnual / 12;
  let paybackPeriodMonths = 0;
  let cumulative = -costs.implementationCost;
  let breakevenMonth = 0;
  const monthlyData = [];

  // Simulate 24 months
  for (let m = 1; m <= 24; m++) {
    cumulative += monthlyGrossSavings;

    if (cumulative >= 0 && breakevenMonth === 0) {
      breakevenMonth = m;
      const prevCumulative = cumulative - monthlyGrossSavings;
      paybackPeriodMonths = (m - 1) + (Math.abs(prevCumulative) / monthlyGrossSavings);
    }

    monthlyData.push({
      month: m,
      cumulativeCashflow: parseFloat(cumulative.toFixed(2)),
      savings: parseFloat(monthlyGrossSavings.toFixed(2))
    });
  }

  // If not broken even in 24 months
  if (breakevenMonth === 0) {
    paybackPeriodMonths = costs.implementationCost / monthlyGrossSavings;
  }

  const hoursSavedAnnually = totalCurrentHoursAnnually - totalFutureHumanHours;
  
  // New KPI Calculations
  // Assuming 1 standard FTE works ~2000 hours/year (40hrs/wk * 50wks)
  const fteCapacityGained = hoursSavedAnnually / 2000;
  
  const efficiencyGainPercent = totalCurrentHoursAnnually > 0 
    ? ((totalCurrentHoursAnnually - totalFutureHumanHours) / totalCurrentHoursAnnually) * 100 
    : 0;

  const costPerTransactionCurrent = annualVolume > 0 ? currentAnnualCost / annualVolume : 0;
  const costPerTransactionFuture = annualVolume > 0 ? futureAnnualTotalCost / annualVolume : 0;

  // Requested KPI: (1 - input.errorRatePercent / 100) * costs.estimatedAutomationPercentage
  const processSuccessRate = (1 - (inputs.errorRatePercent / 100)) * costs.estimatedAutomationPercentage;

  return {
    currentAnnualCost,
    futureAnnualCost: futureAnnualTotalCost + (costs.implementationCost / 5), 
    futureAnnualRecurringCost: futureAnnualTotalCost,
    totalOneTimeInvestment: costs.implementationCost,
    netSavingsYear1,
    netSavingsYear3,
    roiYear1,
    paybackPeriodMonths,
    hoursSavedAnnually,
    breakevenMonth,
    monthlyData,
    // New fields
    fteCapacityGained,
    efficiencyGainPercent,
    costPerTransactionCurrent,
    costPerTransactionFuture,
    errorCostAvoided: errorCostAnnual - (futureReworkHours * inputs.fteHourlyCost),
    processSuccessRate // Returning the new KPI
  };
};