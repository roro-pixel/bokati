import { useState, useCallback } from 'react';
import { BankAccount, BankTransaction, BankReconciliation } from '../../../types';

export interface ReconciliationMatch {
  bankTransactionId: string;
  journalEntryId: string;
  amount: number;
  confidence: number;
  differences: string[];
}

export interface ReconciliationResult {
  matched: number;
  unmatched: number;
  differences: number;
  suggestions: ReconciliationMatch[];
}

export const useBankReconciliation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Données mock pour les comptes bancaires
  const mockBankAccounts: BankAccount[] = [
    {
      id: 'bank-1',
      name: 'Compte Principal',
      bankName: 'BICEC',
      accountNumber: '01234567890',
      accountType: 'CHECKING',
      currency: 'XAF',
      chartAccountId: '512000',
      entity: 'default',
      isActive: true,
      openingBalance: 1500000,
      currentBalance: 1850000,
      overdraftLimit: 500000,
      contactInfo: {
        address: 'Avenue Charles de Gaulle, Yaoundé',
        phone: '+237 222 22 22 22',
        email: 'agence.centre@bicec.cm',
        accountManager: 'M. Ndongo'
      },
      createdAt: new Date('2024-01-01'),
      createdBy: 'system'
    }
  ];

  // Données mock pour les transactions
  const mockBankTransactions: BankTransaction[] = [
    {
      id: 'bt-1',
      bankAccountId: 'bank-1',
      transactionDate: new Date('2024-06-15'),
      valueDate: new Date('2024-06-15'),
      description: 'VIREMENT CLIENT ABC SARL',
      reference: 'VIR-2024-001',
      amount: 1500000,
      balance: 1850000,
      isReconciled: true,
      journalEntryId: 'TRX-2024-001',
      createdAt: new Date('2024-06-15')
    },
    {
      id: 'bt-2',
      bankAccountId: 'bank-1',
      transactionDate: new Date('2024-06-16'),
      valueDate: new Date('2024-06-16'),
      description: 'FRAIS BANCAIRES JUIN',
      reference: 'FRAIS-2024-06',
      amount: -25000,
      balance: 1825000,
      isReconciled: false,
      createdAt: new Date('2024-06-16')
    },
    {
      id: 'bt-3',
      bankAccountId: 'bank-1',
      transactionDate: new Date('2024-06-18'),
      valueDate: new Date('2024-06-18'),
      description: 'PAIEMENT FOURNISSEUR XYZ',
      reference: 'CHQ-789456',
      amount: -450000,
      balance: 1375000,
      isReconciled: false,
      createdAt: new Date('2024-06-18')
    }
  ];

  const [reconciliations, setReconciliations] = useState<BankReconciliation[]>([]);
  const [bankAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [bankTransactions] = useState<BankTransaction[]>(mockBankTransactions);

  // Démarrer un rapprochement
  const startReconciliation = useCallback(async (
    bankAccountId: string,
    periodId: string,
    statementDate: Date,
    statementBalance: number
  ): Promise<BankReconciliation> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newReconciliation: BankReconciliation = {
        id: `recon-${Date.now()}`,
        bankAccountId,
        periodId,
        statementDate,
        statementBalance,
        bookBalance: 0, // À calculer
        reconciledBalance: 0,
        outstandingDeposits: 0,
        outstandingChecks: 0,
        bankCharges: 0,
        interestEarned: 0,
        status: 'IN_PROGRESS',
        createdAt: new Date()
      };

      setReconciliations(prev => [...prev, newReconciliation]);
      return newReconciliation;
    } catch (err) {
      setError('Erreur lors du démarrage du rapprochement');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Faire des suggestions de rapprochement automatique
  const suggestMatches = useCallback(async (
    reconciliationId: string
  ): Promise<ReconciliationResult> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulation de suggestions
      return {
        matched: 8,
        unmatched: 3,
        differences: 12500,
        suggestions: [
          {
            bankTransactionId: 'bt-2',
            journalEntryId: 'TRX-2024-015',
            amount: 25000,
            confidence: 0.95,
            differences: ['Différence de date: 1 jour']
          },
          {
            bankTransactionId: 'bt-3',
            journalEntryId: 'TRX-2024-018',
            amount: 450000,
            confidence: 0.88,
            differences: ['Description légèrement différente']
          }
        ]
      };
    } catch (err) {
      setError('Erreur lors de la génération des suggestions');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Valider un rapprochement
  const validateReconciliation = useCallback(async (
    reconciliationId: string,
    matches: ReconciliationMatch[]
  ): Promise<boolean> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mettre à jour le statut du rapprochement
      setReconciliations(prev => prev.map(recon => 
        recon.id === reconciliationId 
          ? { 
              ...recon, 
              status: 'COMPLETED', 
              reconciledAt: new Date(), 
              reconciledBy: 'current-user' 
            }
          : recon
      ));

      // Marquer les transactions comme rapprochées
      matches.forEach(match => {
        // Dans une vraie implémentation, on mettrait à jour les transactions
        console.log(`Transaction ${match.bankTransactionId} rapprochée avec écriture ${match.journalEntryId}`);
      });

      return true;
    } catch (err) {
      setError('Erreur lors de la validation du rapprochement');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Importer un relevé bancaire
  const importBankStatement = useCallback(async (
    bankAccountId: string,
    file: File
  ): Promise<BankTransaction[]> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulation d'importation
      const newTransactions: BankTransaction[] = [
        {
          id: `bt-import-${Date.now()}-1`,
          bankAccountId,
          transactionDate: new Date('2024-06-20'),
          valueDate: new Date('2024-06-20'),
          description: 'PRÉLÈVEMENT FISCAL',
          reference: 'PREV-2024-06',
          amount: -125000,
          balance: 1250000,
          isReconciled: false,
          createdAt: new Date()
        }
      ];

      return newTransactions;
    } catch (err) {
      setError('Erreur lors de l\'importation du relevé');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtenir les transactions non rapprochées
  const getUnreconciledTransactions = useCallback((bankAccountId: string) => {
    return bankTransactions.filter(
      transaction => 
        transaction.bankAccountId === bankAccountId && 
        !transaction.isReconciled
    );
  }, [bankTransactions]);

  return {
    loading,
    error,
    bankAccounts,
    bankTransactions,
    reconciliations,
    startReconciliation,
    suggestMatches,
    validateReconciliation,
    importBankStatement,
    getUnreconciledTransactions
  };
};