import { useState, useCallback } from 'react';
import { BankAccount, BankTransaction, BankReconciliation, UseBankAccountsReturn } from '../../../types';

export const useBankAccounts = (): UseBankAccountsReturn => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAccount = useCallback(async (
    account: Omit<BankAccount, 'id' | 'currentBalance' | 'createdAt' | 'createdBy'>
  ) => {
    setLoading(true);
    setError(null);
    try {
      // Simulation d'appel API
      const newAccount: BankAccount = {
        ...account,
        id: `acc_${Date.now()}`,
        currentBalance: account.openingBalance,
        createdAt: new Date(),
        createdBy: 'current-user-id' // À remplacer par l'utilisateur connecté
      };
      
      setAccounts(prev => [...prev, newAccount]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAccount = useCallback(async (id: string, updates: Partial<BankAccount>) => {
    setLoading(true);
    setError(null);
    try {
      setAccounts(prev => prev.map(acc => 
        acc.id === id ? { ...acc, ...updates, updatedAt: new Date() } : acc
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du compte');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAccount = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      setAccounts(prev => prev.filter(acc => acc.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression du compte');
    } finally {
      setLoading(false);
    }
  }, []);

  const reconcileAccount = useCallback(async (
    accountId: string, 
    reconciliation: Omit<BankReconciliation, 'id' | 'createdAt'>
  ) => {
    setLoading(true);
    setError(null);
    try {
      // Logique de réconciliation
      console.log('Réconciliation du compte:', accountId, reconciliation);
      // Mettre à jour le statut des transactions
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la réconciliation');
    } finally {
      setLoading(false);
    }
  }, []);

  const getAccountTransactions = useCallback((
    accountId: string, 
    period?: { start: Date; end: Date }
  ): BankTransaction[] => {
    // Simulation - à remplacer par la logique réelle
    return [];
  }, []);

  const getAccountBalance = useCallback((accountId: string): number => {
    const account = accounts.find(acc => acc.id === accountId);
    return account?.currentBalance || 0;
  }, [accounts]);

  return {
    accounts,
    loading,
    error,
    createAccount,
    updateAccount,
    deleteAccount,
    reconcileAccount,
    getAccountTransactions,
    getAccountBalance
  };
};