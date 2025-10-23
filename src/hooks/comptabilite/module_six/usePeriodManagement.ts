import { useState, useCallback } from 'react';
import { FiscalYear, AccountingPeriod, PeriodStatus, PeriodClosingCheck } from '../../../types';

// Données mockées pour les exercices et périodes
const mockFiscalYears: FiscalYear[] = [
  {
    id: 'fy-2024',
    year: '2024',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    entity: 'default',
    isClosed: false,
    createdAt: new Date('2023-12-15'),
    createdBy: 'system'
  },
  {
    id: 'fy-2023',
    year: '2023',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31'),
    entity: 'default',
    isClosed: true,
    closedAt: new Date('2024-01-15'),
    closedBy: 'admin',
    createdAt: new Date('2022-12-15'),
    createdBy: 'system'
  }
];

const mockAccountingPeriods: AccountingPeriod[] = [
  // Périodes 2024
  {
    id: 'period-2024-01',
    fiscalYearId: 'fy-2024',
    periodNumber: 1,
    name: 'Janvier 2024',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    status: 'CLOSED',
    isAdjustmentPeriod: false,
    closedAt: new Date('2024-02-05'),
    closedBy: 'admin',
    createdAt: new Date('2023-12-15')
  },
  {
    id: 'period-2024-02',
    fiscalYearId: 'fy-2024',
    periodNumber: 2,
    name: 'Février 2024',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-29'),
    status: 'CLOSED',
    isAdjustmentPeriod: false,
    closedAt: new Date('2024-03-06'),
    closedBy: 'admin',
    createdAt: new Date('2023-12-15')
  },
  {
    id: 'period-2024-03',
    fiscalYearId: 'fy-2024',
    periodNumber: 3,
    name: 'Mars 2024',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-31'),
    status: 'CLOSED',
    isAdjustmentPeriod: false,
    closedAt: new Date('2024-04-05'),
    closedBy: 'admin',
    createdAt: new Date('2023-12-15')
  },
  {
    id: 'period-2024-04',
    fiscalYearId: 'fy-2024',
    periodNumber: 4,
    name: 'Avril 2024',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-04-30'),
    status: 'CLOSED',
    isAdjustmentPeriod: false,
    closedAt: new Date('2024-05-06'),
    closedBy: 'admin',
    createdAt: new Date('2023-12-15')
  },
  {
    id: 'period-2024-05',
    fiscalYearId: 'fy-2024',
    periodNumber: 5,
    name: 'Mai 2024',
    startDate: new Date('2024-05-01'),
    endDate: new Date('2024-05-31'),
    status: 'CLOSED',
    isAdjustmentPeriod: false,
    closedAt: new Date('2024-06-05'),
    closedBy: 'admin',
    createdAt: new Date('2023-12-15')
  },
  {
    id: 'period-2024-06',
    fiscalYearId: 'fy-2024',
    periodNumber: 6,
    name: 'Juin 2024',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-30'),
    status: 'OPEN',
    isAdjustmentPeriod: false,
    createdAt: new Date('2023-12-15')
  },
  {
    id: 'period-2024-07',
    fiscalYearId: 'fy-2024',
    periodNumber: 7,
    name: 'Juillet 2024',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-07-31'),
    status: 'OPEN',
    isAdjustmentPeriod: false,
    createdAt: new Date('2023-12-15')
  },
  // Période d'ajustement
  {
    id: 'period-2024-13',
    fiscalYearId: 'fy-2024',
    periodNumber: 13,
    name: 'Ajustements 2024',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-31'),
    status: 'OPEN',
    isAdjustmentPeriod: true,
    createdAt: new Date('2023-12-15')
  }
];

export const usePeriodManagement = () => {
  const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>(mockFiscalYears);
  const [periods, setPeriods] = useState<AccountingPeriod[]>(mockAccountingPeriods);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Créer un nouvel exercice fiscal
  const createFiscalYear = useCallback(async (
    fiscalYearData: Omit<FiscalYear, 'id' | 'isClosed' | 'createdAt' | 'createdBy'>
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validation : vérifier qu'il n'y a pas de chevauchement
      const overlappingYear = fiscalYears.find(fy => 
        fy.year === fiscalYearData.year
      );
      
      if (overlappingYear) {
        throw new Error(`Un exercice pour l'année ${fiscalYearData.year} existe déjà`);
      }

      const newFiscalYear: FiscalYear = {
        ...fiscalYearData,
        id: `fy-${fiscalYearData.year}`,
        isClosed: false,
        createdAt: new Date(),
        createdBy: 'current-user'
      };

      // Créer les périodes mensuelles automatiquement
      const newPeriods: AccountingPeriod[] = [];
      for (let i = 1; i <= 12; i++) {
        const periodStart = new Date(parseInt(fiscalYearData.year), i - 1, 1);
        const periodEnd = new Date(parseInt(fiscalYearData.year), i, 0); // Dernier jour du mois
        
        newPeriods.push({
          id: `period-${fiscalYearData.year}-${i.toString().padStart(2, '0')}`,
          fiscalYearId: newFiscalYear.id,
          periodNumber: i,
          name: `${new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(periodStart)} ${fiscalYearData.year}`,
          startDate: periodStart,
          endDate: periodEnd,
          status: 'OPEN',
          isAdjustmentPeriod: false,
          createdAt: new Date()
        });
      }

      // Ajouter la période d'ajustement
      newPeriods.push({
        id: `period-${fiscalYearData.year}-13`,
        fiscalYearId: newFiscalYear.id,
        periodNumber: 13,
        name: `Ajustements ${fiscalYearData.year}`,
        startDate: new Date(parseInt(fiscalYearData.year), 11, 1), // 1er décembre
        endDate: new Date(parseInt(fiscalYearData.year), 11, 31), // 31 décembre
        status: 'OPEN',
        isAdjustmentPeriod: true,
        createdAt: new Date()
      });

      setFiscalYears(prev => [...prev, newFiscalYear]);
      setPeriods(prev => [...prev, ...newPeriods]);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de l\'exercice');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fiscalYears]);

  // Clôturer une période
  const closePeriod = useCallback(async (periodId: string) => {
    setLoading(true);
    try {
      // Vérifications pré-clôture
      const closingCheck = getPeriodStatus(periodId);
      if (!closingCheck.canClose) {
        throw new Error(`Impossible de clôturer: ${closingCheck.errors.join(', ')}`);
      }

      setPeriods(prev => prev.map(period => 
        period.id === periodId 
          ? { 
              ...period, 
              status: 'CLOSED', 
              closedAt: new Date(), 
              closedBy: 'current-user' 
            }
          : period
      ));
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la clôture');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Rouvrir une période
  const reopenPeriod = useCallback(async (periodId: string, reason: string) => {
    setLoading(true);
    try {
      setPeriods(prev => prev.map(period => 
        period.id === periodId 
          ? { 
              ...period, 
              status: 'OPEN', 
              closedAt: undefined, 
              closedBy: undefined 
            }
          : period
      ));
      
      console.log(`Période ${periodId} rouverte - Raison: ${reason}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (err) {
      setError('Erreur lors de la réouverture');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clôturer un exercice fiscal
  const closeFiscalYear = useCallback(async (yearId: string) => {
    setLoading(true);
    try {
      // Vérifier que toutes les périodes sont clôturées
      const openPeriods = periods.filter(p => 
        p.fiscalYearId === yearId && p.status !== 'CLOSED'
      );
      
      if (openPeriods.length > 0) {
        throw new Error(`${openPeriods.length} période(s) non clôturée(s) dans cet exercice`);
      }

      setFiscalYears(prev => prev.map(year => 
        year.id === yearId 
          ? { 
              ...year, 
              isClosed: true, 
              closedAt: new Date(), 
              closedBy: 'current-user' 
            }
          : year
      ));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la clôture de l\'exercice');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [periods]);

  // Obtenir le statut de clôture d'une période
  const getPeriodStatus = useCallback((periodId: string): PeriodClosingCheck => {
    const period = periods.find(p => p.id === periodId);
    if (!period) {
      return {
        periodId,
        checks: {
          allEntriesPosted: false,
          bankReconciliationsComplete: false,
          depreciationCalculated: false,
          accrualsRecorded: false,
          noOpenJournals: false
        },
        errors: ['Période non trouvée'],
        warnings: [],
        canClose: false
      };
    }

    // Simulation des vérifications
    const checks = {
      allEntriesPosted: Math.random() > 0.2, // 80% de chance d'être vrai
      bankReconciliationsComplete: Math.random() > 0.3, // 70% de chance
      depreciationCalculated: Math.random() > 0.1, // 90% de chance
      accrualsRecorded: Math.random() > 0.4, // 60% de chance
      noOpenJournals: Math.random() > 0.2 // 80% de chance
    };

    const errors: string[] = [];
    const warnings: string[] = [];

    if (!checks.allEntriesPosted) {
      errors.push('Certaines écritures ne sont pas comptabilisées');
    }
    if (!checks.bankReconciliationsComplete) {
      warnings.push('Rapprochements bancaires incomplets');
    }
    if (!checks.depreciationCalculated) {
      errors.push('Amortissements non calculés');
    }
    if (!checks.accrualsRecorded) {
      warnings.push('Provisions et régularisations en attente');
    }
    if (!checks.noOpenJournals) {
      errors.push('Journaux non clôturés');
    }

    return {
      periodId,
      checks,
      errors,
      warnings,
      canClose: errors.length === 0
    };
  }, [periods]);

  // Obtenir les périodes d'un exercice
  const getPeriodsByFiscalYear = useCallback((fiscalYearId: string) => {
    return periods.filter(period => period.fiscalYearId === fiscalYearId);
  }, [periods]);

  // Obtenir la période courante
  const getCurrentPeriod = useCallback(() => {
    const now = new Date();
    return periods.find(period => 
      period.startDate <= now && period.endDate >= now && period.status === 'OPEN'
    );
  }, [periods]);

  // Vérifier si une date est dans une période ouverte
  const isDateInOpenPeriod = useCallback((date: Date) => {
    return periods.some(period => 
      period.startDate <= date && 
      period.endDate >= date && 
      period.status === 'OPEN'
    );
  }, [periods]);

  return {
    fiscalYears,
    periods,
    loading,
    error,
    createFiscalYear,
    closePeriod,
    reopenPeriod,
    closeFiscalYear,
    getPeriodStatus,
    getPeriodsByFiscalYear,
    getCurrentPeriod,
    isDateInOpenPeriod
  };
};