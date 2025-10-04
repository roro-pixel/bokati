import { useState, useCallback } from 'react';
import { Journal, JournalStatus, JournalType } from '../../../types';

// Données mockées harmonisées avec le Module 3 et 5
const mockJournals: Journal[] = [
  {
    id: 'journal-1',
    code: 'GEN',
    name: 'Journal Général',
    type: 'GEN',
    entity: 'default',
    sequenceId: 'seq-gen',
    isActive: true,
    requiresApproval: true,
    approvalLevel: 2,
    defaultAccounts: {
      cashAccount: '571000',
      bankAccount: '512000'
    },
    createdAt: new Date('2024-01-01'),
    createdBy: 'system'
  },
  {
    id: 'journal-2', 
    code: 'VTE',
    name: 'Journal des Ventes',
    type: 'VTE',
    entity: 'default',
    sequenceId: 'seq-vte',
    isActive: true,
    requiresApproval: false,
    approvalLevel: 1,
    defaultAccounts: {
      customerAccount: '411000',
      salesAccount: '701000'
    },
    createdAt: new Date('2024-01-01'),
    createdBy: 'system'
  },
  {
    id: 'journal-3',
    code: 'ACH',
    name: 'Journal des Achats', 
    type: 'ACH',
    entity: 'default',
    sequenceId: 'seq-ach',
    isActive: true,
    requiresApproval: true,
    approvalLevel: 1,
    defaultAccounts: {
      supplierAccount: '401000',
      expenseAccount: '601000'
    },
    createdAt: new Date('2024-01-01'),
    createdBy: 'system'
  },
  {
    id: 'journal-4',
    code: 'BNQ',
    name: 'Journal de Banque',
    type: 'BNQ',
    entity: 'default', 
    sequenceId: 'seq-bnq',
    isActive: true,
    requiresApproval: false,
    approvalLevel: 1,
    defaultAccounts: {
      bankAccount: '512000'
    },
    createdAt: new Date('2024-01-01'),
    createdBy: 'system'
  },
  {
    id: 'journal-5',
    code: 'CAI',
    name: 'Journal de Caisse',
    type: 'CAI',
    entity: 'default',
    sequenceId: 'seq-cai', 
    isActive: true,
    requiresApproval: false,
    approvalLevel: 1,
    defaultAccounts: {
      cashAccount: '571000'
    },
    createdAt: new Date('2024-01-01'),
    createdBy: 'system'
  }
];

const mockJournalStatus: JournalStatus[] = [
  {
    journalId: 'journal-1',
    periodId: 'period-2024-01',
    isClosed: false,
    totalEntries: 45,
    totalDebit: 1250000,
    totalCredit: 1250000,
    closedAt: undefined
  },
  {
    journalId: 'journal-2',
    periodId: 'period-2024-01', 
    isClosed: false,
    totalEntries: 28,
    totalDebit: 850000,
    totalCredit: 850000,
    closedAt: undefined
  }
];

export const useJournalManagement = () => {
  const [journals, setJournals] = useState<Journal[]>(mockJournals);
  const [journalStatus, setJournalStatus] = useState<JournalStatus[]>(mockJournalStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Créer un nouveau journal
  const createJournal = useCallback(async (journalData: Omit<Journal, 'id' | 'createdAt' | 'createdBy'>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validation basique
      if (journals.find(j => j.code === journalData.code)) {
        throw new Error('Un journal avec ce code existe déjà');
      }

      const newJournal: Journal = {
        ...journalData,
        id: `journal-${Date.now()}`,
        createdAt: new Date(),
        createdBy: 'current-user'
      };

      setJournals(prev => [...prev, newJournal]);
      
      // Créer le statut du journal
      const newStatus: JournalStatus = {
        journalId: newJournal.id,
        periodId: 'period-current',
        isClosed: false,
        totalEntries: 0,
        totalDebit: 0,
        totalCredit: 0
      };
      
      setJournalStatus(prev => [...prev, newStatus]);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du journal');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [journals]);

  // Modifier un journal
  const updateJournal = useCallback(async (id: string, updates: Partial<Journal>) => {
    setLoading(true);
    try {
      setJournals(prev => prev.map(journal => 
        journal.id === id ? { ...journal, ...updates } : journal
      ));
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      setError('Erreur lors de la modification du journal');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Désactiver un journal
  const deactivateJournal = useCallback(async (id: string) => {
    setLoading(true);
    try {
      setJournals(prev => prev.map(journal => 
        journal.id === id ? { ...journal, isActive: false } : journal
      ));
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      setError('Erreur lors de la désactivation du journal');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clôturer un journal
  const closeJournal = useCallback(async (journalId: string, periodId: string) => {
    setLoading(true);
    try {
      setJournalStatus(prev => prev.map(status => 
        status.journalId === journalId && status.periodId === periodId 
          ? { ...status, isClosed: true, closedAt: new Date() }
          : status
      ));
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      setError('Erreur lors de la clôture du journal');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Rouvrir un journal
  const reopenJournal = useCallback(async (journalId: string, periodId: string) => {
    setLoading(true);
    try {
      setJournalStatus(prev => prev.map(status => 
        status.journalId === journalId && status.periodId === periodId 
          ? { ...status, isClosed: false, closedAt: undefined }
          : status
      ));
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      setError('Erreur lors de la réouverture du journal');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtenir le statut d'un journal
  const getJournalStatus = useCallback((journalId: string, periodId: string) => {
    return journalStatus.find(status => 
      status.journalId === journalId && status.periodId === periodId
    );
  }, [journalStatus]);

  // Vérifier si un journal peut être clôturé
  const canCloseJournal = useCallback((journalId: string, periodId: string) => {
    const status = getJournalStatus(journalId, periodId);
    if (!status) return { canClose: false, reason: 'Statut non trouvé' };
    
    if (status.isClosed) return { canClose: false, reason: 'Journal déjà clôturé' };
    if (status.totalDebit !== status.totalCredit) return { canClose: false, reason: 'Journal déséquilibré' };
    
    return { canClose: true, reason: '' };
  }, [getJournalStatus]);

  // Mettre à jour les statistiques du journal (appelé par le Module 5)
  const updateJournalStats = useCallback((journalId: string, entryCount: number, debit: number, credit: number) => {
    setJournalStatus(prev => prev.map(status => 
      status.journalId === journalId && !status.isClosed
        ? {
            ...status,
            totalEntries: status.totalEntries + entryCount,
            totalDebit: status.totalDebit + debit,
            totalCredit: status.totalCredit + credit
          }
        : status
    ));
  }, []);

  return {
    journals,
    journalStatus,
    loading,
    error,
    createJournal,
    updateJournal,
    deactivateJournal,
    closeJournal,
    reopenJournal,
    getJournalStatus,
    canCloseJournal,
    updateJournalStats
  };
};