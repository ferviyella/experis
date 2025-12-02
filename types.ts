
export interface ProcessInputs {
  processName: string;
  volumePerMonth: number;
  timePerTransactionMinutes: number;
  errorRatePercent: number;
  fteHourlyCost: number;
  reworkTimeMinutes: number;
}

export interface AutomationCosts {
  implementationCost: number; // One-time dev cost
  annualLicenseCost: number; // Recurring
  annualMaintenanceCost: number; // Recurring
  estimatedAutomationPercentage: number; // How much of the process is automated (e.g., 90%)
}

export interface CalculationResults {
  currentAnnualCost: number;
  futureAnnualCost: number;
  futureAnnualRecurringCost: number;
  totalOneTimeInvestment: number;
  netSavingsYear1: number;
  netSavingsYear3: number;
  roiYear1: number;
  paybackPeriodMonths: number;
  hoursSavedAnnually: number;
  breakevenMonth: number;
  
  // New KPIs
  fteCapacityGained: number; // Equivalent FTEs freed up
  efficiencyGainPercent: number;
  costPerTransactionCurrent: number;
  costPerTransactionFuture: number;
  errorCostAvoided: number;
  processSuccessRate: number; // New KPI added

  monthlyData: { month: number; cumulativeCashflow: number; savings: number }[];
}

export interface AiProposalState {
  isLoading: boolean;
  content: string | null;
  error: string | null;
}