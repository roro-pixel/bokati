import { useState, useCallback } from 'react';
import { 
  CashFlowForecast, 
  CashFlowScenario, 
  CashPosition, 
  UseCashFlowReturn 
} from '../../../types';


export const useCashFlow = (): UseCashFlowReturn => {
  const [forecasts, setForecasts] = useState<CashFlowForecast[]>([]);
  const [scenarios, setScenarios] = useState<CashFlowScenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createForecast = useCallback(async (
    forecast: Omit<CashFlowForecast, 'id' | 'createdAt' | 'createdBy'>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const newForecast: CashFlowForecast = {
        ...forecast,
        id: `fc_${Date.now()}`,
        createdAt: new Date(),
        createdBy: 'current-user-id'
      };
      
      setForecasts(prev => [...prev, newForecast]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de la prévision');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateForecast = useCallback(async (id: string, updates: Partial<CashFlowForecast>) => {
    setLoading(true);
    setError(null);
    try {
      setForecasts(prev => prev.map(fc => 
        fc.id === id ? { ...fc, ...updates } : fc
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la prévision');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteForecast = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      setForecasts(prev => prev.filter(fc => fc.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de la prévision');
    } finally {
      setLoading(false);
    }
  }, []);

  const createScenario = useCallback(async (
    scenario: Omit<CashFlowScenario, 'id' | 'createdAt' | 'createdBy'>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const newScenario: CashFlowScenario = {
        ...scenario,
        id: `scenario_${Date.now()}`,
        createdAt: new Date(),
        createdBy: 'current-user-id'
      };
      
      setScenarios(prev => [...prev, newScenario]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du scénario');
    } finally {
      setLoading(false);
    }
  }, []);

  const runScenario = useCallback((scenarioId: string): CashFlowForecast => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) {
      throw new Error('Scénario non trouvé');
    }

    // Simulation de calcul de prévision basé sur le scénario
    const forecast: CashFlowForecast = {
      id: `run_${Date.now()}`,
      entity: scenario.entity,
      forecastDate: new Date(),
      periodType: 'MONTHLY',
      cashPosition: {
        beginningBalance: 0,
        expectedReceipts: 100000,
        expectedPayments: 80000,
        endingBalance: 20000
      },
      details: [],
      createdAt: new Date(),
      createdBy: 'system'
    };

    return forecast;
  }, [scenarios]);

  const getCashPosition = useCallback((date?: Date): CashPosition => {
    const targetDate = date || new Date();
    
    // Simulation - à remplacer par la logique réelle
    return {
      id: `pos_${targetDate.getTime()}`,
      entity: 'current-entity',
      date: targetDate,
      bankBalances: [],
      cashOnHand: 0,
      totalCash: 0,
      upcomingPayments: 0,
      expectedReceipts: 0,
      netCashFlow: 0,
      minimumBalance: 0,
      targetBalance: 0,
      alertThreshold: 0,
      createdAt: new Date()
    };
  }, []);

  const analyzeVariance = useCallback((forecastId: string, actualData: any) => {
    // Logique d'analyse de variance
    return {
      variances: [],
      insights: ['Analyse à implémenter']
    };
  }, []);

  return {
    forecasts,
    scenarios,
    loading,
    error,
    createForecast,
    updateForecast,
    deleteForecast,
    createScenario,
    runScenario,
    getCashPosition,
    analyzeVariance
  };
};