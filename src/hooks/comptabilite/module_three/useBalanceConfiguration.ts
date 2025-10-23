// src/hooks/comptabilite/module_three/useBalanceConfiguration.ts
import { useState, useCallback } from 'react';

export interface BalanceConfiguration {
  id: string;
  entity: string;
  includeDraftEntries: boolean;
  includeReversedEntries: boolean;
  groupByAuxiliary: boolean;
  showZeroBalance: boolean;
  roundToNearest: number;
  validationRules: {
    maxDifference: number;
    allowUnbalanced: boolean;
    strictSYSCOHADA: boolean;
  };
  reportSettings: {
    includeOpeningBalance: boolean;
    includePeriodMovement: boolean;
    includeClosingBalance: boolean;
    showComparative: boolean;
  };
}

export const useBalanceConfiguration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [configuration, setConfiguration] = useState<BalanceConfiguration>({
    id: 'balance-config-1',
    entity: 'default',
    includeDraftEntries: false,
    includeReversedEntries: false,
    groupByAuxiliary: true,
    showZeroBalance: false,
    roundToNearest: 1,
    validationRules: {
      maxDifference: 0.01,
      allowUnbalanced: false,
      strictSYSCOHADA: true
    },
    reportSettings: {
      includeOpeningBalance: true,
      includePeriodMovement: true,
      includeClosingBalance: true,
      showComparative: false
    }
  });

  const updateConfiguration = useCallback(async (updates: Partial<BalanceConfiguration>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setConfiguration(prev => ({ ...prev, ...updates }));
    } catch (err) {
      setError('Erreur lors de la mise à jour de la configuration');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetToDefault = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setConfiguration({
        id: 'balance-config-1',
        entity: 'default',
        includeDraftEntries: false,
        includeReversedEntries: false,
        groupByAuxiliary: true,
        showZeroBalance: false,
        roundToNearest: 1,
        validationRules: {
          maxDifference: 0.01,
          allowUnbalanced: false,
          strictSYSCOHADA: true
        },
        reportSettings: {
          includeOpeningBalance: true,
          includePeriodMovement: true,
          includeClosingBalance: true,
          showComparative: false
        }
      });
    } catch (err) {
      setError('Erreur lors de la réinitialisation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const validateConfiguration = useCallback((config: BalanceConfiguration) => {
    const errors: string[] = [];

    if (config.validationRules.maxDifference < 0) {
      errors.push('La différence maximale ne peut pas être négative');
    }

    if (config.roundToNearest < 0) {
      errors.push('L\'arrondi ne peut pas être négatif');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  return {
    configuration,
    loading,
    error,
    updateConfiguration,
    resetToDefault,
    validateConfiguration
  };
};