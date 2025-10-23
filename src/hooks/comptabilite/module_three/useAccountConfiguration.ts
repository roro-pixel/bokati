// src/hooks/comptabilite/module_three/useAccountConfiguration.ts
import { useState, useCallback } from 'react';
import { ChartAccount } from '../../../types';
import { useChartOfAccounts } from './useChartOfAccounts';
import { useAccountValidation } from './useAccountValidation';
import { useSYSCOHADACompliance } from './useSYSCOHADACompliance';

export const useAccountConfiguration = () => {
  const {
    accounts,
    loading,
    error,
    createAccount,
    updateAccount,
    deleteAccount,
    validateSYSCOHADA,
    searchAccounts,
    getAccountHierarchy
  } = useChartOfAccounts();

  const {
    validateAccount,
    validateChartStructure,
    generateChildCode,
    canDeactivateAccount,
    classRules,
    mandatoryAccounts
  } = useAccountValidation();

  const {
    checkCompliance,
    checkAccountCompliance,
    generateComplianceReport,
    exportSYSCOHADAFormat,
    namingConventions
  } = useSYSCOHADACompliance();

  const [selectedAccount, setSelectedAccount] = useState<ChartAccount | null>(null);

  // Créer un compte avec validation complète
  const createAccountWithValidation = useCallback(async (
    accountData: Omit<ChartAccount, 'id' | 'createdAt' | 'createdBy'>
  ) => {
    // Validation SYSCOHADA
    const syscohadaValidation = validateSYSCOHADA(accountData as ChartAccount);
    if (!syscohadaValidation.isValid) {
      throw new Error(syscohadaValidation.errors.join(', '));
    }

    // Validation du compte
    const accountValidation = validateAccount(accountData as ChartAccount);
    if (!accountValidation.isValid) {
      throw new Error(accountValidation.errors.join(', '));
    }

    return await createAccount(accountData);
  }, [createAccount, validateSYSCOHADA, validateAccount]);

  // Modifier un compte avec validation
  const updateAccountWithValidation = useCallback(async (id: string, updates: Partial<ChartAccount>) => {
    const account = accounts.find(acc => acc.id === id);
    if (!account) throw new Error('Compte non trouvé');

    const updatedAccount = { ...account, ...updates };
    
    // Validation SYSCOHADA
    const syscohadaValidation = validateSYSCOHADA(updatedAccount);
    if (!syscohadaValidation.isValid) {
      throw new Error(syscohadaValidation.errors.join(', '));
    }

    // Validation du compte
    const accountValidation = validateAccount(updatedAccount);
    if (!accountValidation.isValid) {
      throw new Error(accountValidation.errors.join(', '));
    }

    return await updateAccount(id, updates);
  }, [accounts, updateAccount, validateSYSCOHADA, validateAccount]);

  // Vérifier si un compte peut être désactivé
  const canDeactivate = useCallback((accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return { canDeactivate: false, reasons: ['Compte non trouvé'] };
    
    return canDeactivateAccount(account, accounts);
  }, [accounts, canDeactivateAccount]);

  // Obtenir les comptes par classe
  const getAccountsByClass = useCallback((classNumber: string) => {
    return accounts.filter(acc => acc.class === classNumber && acc.isActive);
  }, [accounts]);

  // Obtenir la structure hiérarchique complète
  const getFullHierarchy = useCallback(() => {
    const hierarchy = getAccountHierarchy();
    const rootAccounts = accounts.filter(acc => !acc.parentId && acc.isActive);
    
    return rootAccounts.map(root => ({
      ...root,
      children: hierarchy[root.id] || []
    }));
  }, [accounts, getAccountHierarchy]);

  // Vérifier la conformité globale
  const checkGlobalCompliance = useCallback(() => {
    return checkCompliance(accounts);
  }, [accounts, checkCompliance]);

  return {
    // Données
    accounts: accounts.filter(acc => acc.isActive),
    selectedAccount,
    
    // États
    loading,
    error,
    
    // Actions
    createAccount: createAccountWithValidation,
    updateAccount: updateAccountWithValidation,
    deleteAccount,
    
    // Validation
    validateAccount,
    validateChartStructure,
    validateSYSCOHADA,
    
    // Utilitaires
    searchAccounts,
    getAccountHierarchy: getFullHierarchy,
    getAccountsByClass,
    generateChildCode,
    canDeactivate,
    
    // Conformité SYSCOHADA
    checkCompliance: checkGlobalCompliance,
    checkAccountCompliance,
    generateComplianceReport,
    exportSYSCOHADAFormat,
    
    // Règles et conventions
    classRules,
    mandatoryAccounts,
    namingConventions,
    
    // Sélection
    setSelectedAccount
  };
};