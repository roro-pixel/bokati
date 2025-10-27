import { useState, useCallback } from 'react';
import { 
  Budget, 
  Engagement, 
  CashPosition, 
  BudgetVarianceAnalysis,
  CashFlowAnalysis,
  TreasuryReport,
  UseTreasuryManagementReturn 
} from '../../../types';

export const useTreasuryManagement = (): UseTreasuryManagementReturn => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [cashPositions, setCashPositions] = useState<CashPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBudget = useCallback(async (
    budget: Omit<Budget, 'id' | 'createdAt' | 'createdBy'>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const newBudget: Budget = {
        ...budget,
        id: `budget_${Date.now()}`,
        createdAt: new Date(),
        createdBy: 'current-user-id'
      };
      
      setBudgets(prev => [...prev, newBudget]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du budget');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBudget = useCallback(async (id: string, updates: Partial<Budget>) => {
    setLoading(true);
    setError(null);
    try {
      setBudgets(prev => prev.map(budget => 
        budget.id === id ? { ...budget, ...updates, updatedAt: new Date() } : budget
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du budget');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitBudget = useCallback(async (budgetId: string) => {
    setLoading(true);
    setError(null);
    try {
      setBudgets(prev => prev.map(budget => 
        budget.id === budgetId 
          ? { 
              ...budget, 
              status: 'SUBMITTED', 
              submittedAt: new Date(),
              submittedBy: 'current-user-id'
            } 
          : budget
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la soumission du budget');
    } finally {
      setLoading(false);
    }
  }, []);

  const approveBudget = useCallback(async (budgetId: string) => {
    setLoading(true);
    setError(null);
    try {
      setBudgets(prev => prev.map(budget => 
        budget.id === budgetId 
          ? { 
              ...budget, 
              status: 'APPROVED', 
              approvedAt: new Date(),
              approvedBy: 'current-user-id'
            } 
          : budget
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'approbation du budget');
    } finally {
      setLoading(false);
    }
  }, []);

  const createEngagement = useCallback(async (
    engagement: Omit<Engagement, 'id' | 'engagementNumber' | 'createdAt' | 'createdBy'>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const newEngagement: Engagement = {
        ...engagement,
        id: `eng_${Date.now()}`,
        engagementNumber: `ENG-${new Date().getFullYear()}-${Date.now()}`,
        createdAt: new Date(),
        createdBy: 'current-user-id'
      };
      
      setEngagements(prev => [...prev, newEngagement]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de l\'engagement');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEngagement = useCallback(async (id: string, updates: Partial<Engagement>) => {
    setLoading(true);
    setError(null);
    try {
      setEngagements(prev => prev.map(eng => 
        eng.id === id ? { ...eng, ...updates, updatedAt: new Date() } : eng
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'engagement');
    } finally {
      setLoading(false);
    }
  }, []);

  const commitEngagement = useCallback(async (engagementId: string) => {
    setLoading(true);
    setError(null);
    try {
      setEngagements(prev => prev.map(eng => 
        eng.id === engagementId 
          ? { ...eng, status: 'COMMITTED' } 
          : eng
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'engagement');
    } finally {
      setLoading(false);
    }
  }, []);

  const getBudgetVariance = useCallback((budgetId: string): BudgetVarianceAnalysis => {
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) {
      throw new Error('Budget non trouvé');
    }

    // Simulation d'analyse de variance
    return {
      lines: budget.lines.map(line => ({
        accountCode: line.accountCode,
        accountName: line.accountName,
        budgetAmount: line.totalAmount,
        actualAmount: line.totalActual,
        varianceAmount: line.variance,
        variancePercentage: line.variancePercentage,
        status: line.variancePercentage > 10 ? 'OVER' : line.variancePercentage < -10 ? 'UNDER' : 'ON_TRACK'
      })),
      totalBudget: budget.totalAmount,
      totalActual: budget.actualSpent,
      totalVariance: budget.remainingAmount,
      overallVariancePercentage: (budget.remainingAmount / budget.totalAmount) * 100,
      alerts: budget.remainingAmount < 0 ? ['Dépassement budgétaire'] : []
    };
  }, [budgets]);

  const getCashFlowAnalysis = useCallback((period: { start: Date; end: Date }): CashFlowAnalysis => {
    // Simulation d'analyse des flux de trésorerie
    return {
      period,
      openingBalance: 0,
      closingBalance: 0,
      netCashFlow: 0,
      operatingActivities: {
        receipts: 0,
        payments: 0,
        netCash: 0
      },
      investingActivities: {
        capitalExpenditure: 0,
        assetSales: 0,
        netCash: 0
      },
      financingActivities: {
        loansReceived: 0,
        loansRepaid: 0,
        dividends: 0,
        netCash: 0
      },
      trends: {
        cashFlowStability: 'MEDIUM',
        liquidityRisk: 'LOW',
        recommendations: ['Analyser les délais de paiement clients']
      }
    };
  }, []);

  const generateTreasuryReport = useCallback((period: { start: Date; end: Date }): TreasuryReport => {
    const cashAnalysis = getCashFlowAnalysis(period);
    
    return {
      period,
      generatedAt: new Date(),
      cashPosition: {
        beginningBalance: 0,
        endingBalance: 0,
        minimumBalance: 0,
        targetBalance: 0,
        status: 'HEALTHY'
      },
      cashFlows: cashAnalysis,
      budgetPerformance: getBudgetVariance(budgets[0]?.id || ''),
      commitments: {
        totalCommitted: engagements.reduce((sum, eng) => sum + eng.committedAmount, 0),
        paidToDate: engagements.reduce((sum, eng) => sum + eng.paidAmount, 0),
        upcomingPayments: engagements.reduce((sum, eng) => sum + eng.dueAmount, 0),
        paymentSchedule: []
      },
      alerts: [],
      recommendations: ['Maintenir un suivi régulier de la trésorerie']
    };
  }, [budgets, engagements, getBudgetVariance, getCashFlowAnalysis]);

  return {
    cashPositions,
    budgets,
    engagements,
    loading,
    error,
    createBudget,
    updateBudget,
    submitBudget,
    approveBudget,
    createEngagement,
    updateEngagement,
    commitEngagement,
    getBudgetVariance,
    getCashFlowAnalysis,
    generateTreasuryReport
  };
};