import { useState, useCallback } from 'react';
import { FiscalYear } from '../../../types';

export interface FiscalYearSetup {
  year: string;
  startDate: Date;
  endDate: Date;
  copyFromPrevious: boolean;
  includeOpeningBalances: boolean;
}

export const useFiscalYear = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Valider la configuration d'un nouvel exercice
  const validateFiscalYear = useCallback((setup: FiscalYearSetup) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validation de l'année
    const yearNum = parseInt(setup.year);
    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      errors.push('L\'année doit être comprise entre 2000 et 2100');
    }

    // Validation des dates
    if (setup.startDate >= setup.endDate) {
      errors.push('La date de début doit être antérieure à la date de fin');
    }

    // Vérifier la durée (doit couvrir une année complète)
    const startYear = setup.startDate.getFullYear();
    const endYear = setup.endDate.getFullYear();
    
    if (startYear !== endYear) {
      warnings.push('L\'exercice couvre plusieurs années civiles');
    }

    // Vérifier le 1er janvier comme date de début typique
    if (setup.startDate.getMonth() !== 0 || setup.startDate.getDate() !== 1) {
      warnings.push('L\'exercice ne commence pas le 1er janvier');
    }

    // Vérifier le 31 décembre comme date de fin typique
    if (setup.endDate.getMonth() !== 11 || setup.endDate.getDate() !== 31) {
      warnings.push('L\'exercice ne se termine pas le 31 décembre');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }, []);

  // Générer les périodes pour un nouvel exercice
  const generatePeriods = useCallback((fiscalYear: FiscalYearSetup) => {
    const periods = [];
    const startDate = new Date(fiscalYear.startDate);
    
    for (let i = 1; i <= 12; i++) {
      const periodStart = new Date(startDate.getFullYear(), i - 1, 1);
      const periodEnd = new Date(startDate.getFullYear(), i, 0); // Dernier jour du mois
      
      periods.push({
        number: i,
        name: `${periodStart.toLocaleDateString('fr-FR', { month: 'long' })} ${startDate.getFullYear()}`,
        startDate: periodStart,
        endDate: periodEnd,
        isAdjustment: false
      });
    }

    // Période d'ajustement (décembre)
    periods.push({
      number: 13,
      name: `Ajustements ${startDate.getFullYear()}`,
      startDate: new Date(startDate.getFullYear(), 11, 1),
      endDate: new Date(startDate.getFullYear(), 11, 31),
      isAdjustment: true
    });

    return periods;
  }, []);

  // Calculer les soldes d'ouverture depuis l'exercice précédent
  const calculateOpeningBalances = useCallback(async (previousYearId: string) => {
    setLoading(true);
    try {
      // Simulation du calcul des soldes d'ouverture
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Retourner des données mockées
      return {
        success: true,
        accounts: [
          { code: '101000', debit: 0, credit: 5000000, description: 'Capital social' },
          { code: '512000', debit: 1500000, credit: 0, description: 'Banque' },
          { code: '571000', debit: 50000, credit: 0, description: 'Caisse' },
          { code: '411000', debit: 800000, credit: 0, description: 'Clients' },
          { code: '401000', debit: 0, credit: 450000, description: 'Fournisseurs' }
        ],
        totalDebit: 2350000,
        totalCredit: 5450000,
        isBalanced: false,
        difference: -3100000
      };
    } catch (err) {
      setError('Erreur lors du calcul des soldes d\'ouverture');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Vérifier si un exercice peut être clôturé
  const canCloseFiscalYear = useCallback((yearId: string, allPeriods: any[]) => {
    const yearPeriods = allPeriods.filter(p => p.fiscalYearId === yearId);
    const openPeriods = yearPeriods.filter(p => p.status !== 'CLOSED');
    const adjustmentPeriod = yearPeriods.find(p => p.isAdjustmentPeriod);

    const reasons: string[] = [];

    if (openPeriods.length > 0) {
      reasons.push(`${openPeriods.length} période(s) non clôturée(s)`);
    }

    if (!adjustmentPeriod || adjustmentPeriod.status !== 'CLOSED') {
      reasons.push('Période d\'ajustement non clôturée');
    }

    // Vérifier l'équilibre des comptes de bilan
    const isBalanced = Math.random() > 0.3; // Simulation
    if (!isBalanced) {
      reasons.push('Balance générale déséquilibrée');
    }

    return {
      canClose: reasons.length === 0,
      reasons
    };
  }, []);

  return {
    loading,
    error,
    validateFiscalYear,
    generatePeriods,
    calculateOpeningBalances,
    canCloseFiscalYear
  };
};