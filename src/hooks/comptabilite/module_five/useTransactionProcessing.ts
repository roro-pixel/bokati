import { useState, useCallback } from 'react';
import { JournalEntry, JournalEntryLine, EntryValidationResult, UseTransactionProcessingReturn } from '../../../types';

export const useTransactionProcessing = (): UseTransactionProcessingReturn => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Créer une nouvelle écriture
  const createEntry = useCallback(async (
    entryData: Omit<JournalEntry, 'id' | 'entryNumber' | 'status' | 'createdAt' | 'createdBy' | 'totalDebit' | 'totalCredit'>
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Calculer les totaux
      const totalDebit = entryData.lines
        .filter(line => line.type === 'DEBIT')
        .reduce((sum, line) => sum + line.amount, 0);
      
      const totalCredit = entryData.lines
        .filter(line => line.type === 'CREDIT')
        .reduce((sum, line) => sum + line.amount, 0);

      // Simuler la génération du numéro d'écriture
      const entryNumber = `JOURNAL-${new Date().getFullYear()}-${String(entries.length + 1).padStart(6, '0')}`;

      const newEntry: JournalEntry = {
        ...entryData,
        id: `entry-${Date.now()}`,
        entryNumber,
        status: 'DRAFT',
        totalDebit,
        totalCredit,
        createdAt: new Date(),
        createdBy: 'current-user-id' // À remplacer par l'utilisateur connecté
      };

      setEntries(prev => [...prev, newEntry]);
      
      // Simuler appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de l\'écriture');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [entries.length]);

  // Soumettre pour approbation
  const submitForApproval = useCallback(async (entryId: string) => {
    setLoading(true);
    try {
      setEntries(prev => prev.map(entry => 
        entry.id === entryId 
          ? { ...entry, status: 'SUBMITTED', submittedAt: new Date() }
          : entry
      ));
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      setError('Erreur lors de la soumission');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Approuver une écriture
  const approveEntry = useCallback(async (entryId: string, comments?: string) => {
    setLoading(true);
    try {
      setEntries(prev => prev.map(entry => 
        entry.id === entryId 
          ? { 
              ...entry, 
              status: 'APPROVED', 
              approvedAt: new Date(),
              approvedBy: 'current-user-id'
            }
          : entry
      ));
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      setError('Erreur lors de l\'approbation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Rejeter une écriture
  const rejectEntry = useCallback(async (entryId: string, comments: string) => {
    setLoading(true);
    try {
      setEntries(prev => prev.map(entry => 
        entry.id === entryId 
          ? { ...entry, status: 'REJECTED' }
          : entry
      ));
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      setError('Erreur lors du rejet');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Poster une écriture (définitif)
  const postEntry = useCallback(async (entryId: string) => {
    setLoading(true);
    try {
      setEntries(prev => prev.map(entry => 
        entry.id === entryId 
          ? { 
              ...entry, 
              status: 'POSTED', 
              postedAt: new Date(),
              postedBy: 'current-user-id'
            }
          : entry
      ));
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      setError('Erreur lors du posting');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Contre-passement
  const reverseEntry = useCallback(async (entryId: string, reason: string) => {
    setLoading(true);
    try {
      const originalEntry = entries.find(entry => entry.id === entryId);
      if (!originalEntry) throw new Error('Écriture non trouvée');

      // Créer l'écriture de contre-passement
      const reversalLines: JournalEntryLine[] = originalEntry.lines.map(line => ({
        ...line,
        id: `line-${Date.now()}-${Math.random()}`,
        type: line.type === 'DEBIT' ? 'CREDIT' : 'DEBIT' // Inverser le type
      }));

      const reversalEntry: Omit<JournalEntry, 'id' | 'entryNumber' | 'createdAt' | 'createdBy'> = {
        journalId: originalEntry.journalId,
        entity: originalEntry.entity,
        entryDate: new Date(),
        accountingDate: new Date(),
        description: `Contre-passement: ${originalEntry.description}`,
        referenceDocument: originalEntry.referenceDocument,
        status: 'DRAFT',
        totalDebit: originalEntry.totalCredit, // Inversé
        totalCredit: originalEntry.totalDebit, // Inversé
        lines: reversalLines,
        submittedBy: 'current-user-id',
        reversalOf: originalEntry.id,
        reversalReason: reason
      };

      await createEntry(reversalEntry);
      
    } catch (err) {
      setError('Erreur lors du contre-passement');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [entries, createEntry]);

  // Valider une écriture
  const validateEntry = useCallback((entry: JournalEntry): EntryValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Vérification de l'équilibre
    const isBalanced = Math.abs(entry.totalDebit - entry.totalCredit) < 0.01;
    if (!isBalanced) {
      errors.push(`Écriture déséquilibrée: Débit ${entry.totalDebit} ≠ Crédit ${entry.totalCredit}`);
    }

    // Vérification des comptes
    const hasValidAccounts = entry.lines.every(line => line.accountId);
    if (!hasValidAccounts) {
      errors.push('Certains comptes ne sont pas valides');
    }

    // Vérification de la période (simulée)
    const isOpen = true; // À implémenter avec la gestion des périodes

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      balanceCheck: {
        isBalanced,
        debitTotal: entry.totalDebit,
        creditTotal: entry.totalCredit,
        difference: entry.totalDebit - entry.totalCredit
      },
      periodCheck: {
        isOpen,
        periodId: 'current-period' // À remplacer
      },
      accountChecks: {
        validAccounts: hasValidAccounts,
        activeAccounts: true, // À implémenter
        SYSCOHADACompliant: true // À implémenter
      }
    };
  }, []);

  return {
    entries,
    loading,
    error,
    createEntry,
    submitForApproval,
    approveEntry,
    rejectEntry,
    postEntry,
    reverseEntry,
    validateEntry
  };
};