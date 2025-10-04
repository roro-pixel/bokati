import { useState, useCallback } from 'react';
import { ChartAccount, AccountBalance, UseChartOfAccountsReturn } from '../../../types';

// Données mockées pour le plan comptable SYSCOHADA
const mockAccounts: ChartAccount[] = [
  // Classe 1 - Ressources durables
  {
    id: '1',
    code: '10',
    name: 'CAPITAL',
    class: '1',
    type: 'EQUITY',
    level: 1,
    isAuxiliary: false,
    isReconcilable: false,
    isActive: true,
    entity: 'default',
    createdAt: new Date(),
    createdBy: 'system'
  },
  {
    id: '2',
    code: '101',
    name: 'Capital social',
    class: '1',
    type: 'EQUITY',
    parentId: '1',
    level: 2,
    isAuxiliary: false,
    isReconcilable: false,
    isActive: true,
    entity: 'default',
    createdAt: new Date(),
    createdBy: 'system'
  },
  // Classe 2 - Actif immobilisé
  {
    id: '3',
    code: '21',
    name: 'IMMOBILISATIONS INCORPORELLES',
    class: '2',
    type: 'ASSET',
    level: 1,
    isAuxiliary: false,
    isReconcilable: false,
    isActive: true,
    entity: 'default',
    createdAt: new Date(),
    createdBy: 'system'
  },
  {
    id: '4',
    code: '211',
    name: 'Frais d\'établissement',
    class: '2',
    type: 'ASSET',
    parentId: '3',
    level: 2,
    isAuxiliary: false,
    isReconcilable: false,
    isActive: true,
    entity: 'default',
    createdAt: new Date(),
    createdBy: 'system'
  },
  // Classe 4 - Tiers
  {
    id: '5',
    code: '41',
    name: 'CLIENTS ET COMPTES RATTACHÉS',
    class: '4',
    type: 'ASSET',
    level: 1,
    isAuxiliary: true,
    isReconcilable: true,
    isActive: true,
    entity: 'default',
    createdAt: new Date(),
    createdBy: 'system'
  },
  {
    id: '6',
    code: '411',
    name: 'Clients',
    class: '4',
    type: 'ASSET',
    parentId: '5',
    level: 2,
    isAuxiliary: true,
    isReconcilable: true,
    isActive: true,
    entity: 'default',
    createdAt: new Date(),
    createdBy: 'system'
  },
  // Classe 5 - Trésorerie
  {
    id: '7',
    code: '57',
    name: 'CAISSE',
    class: '5',
    type: 'ASSET',
    level: 1,
    isAuxiliary: false,
    isReconcilable: true,
    isActive: true,
    entity: 'default',
    createdAt: new Date(),
    createdBy: 'system'
  },
  {
    id: '8',
    code: '571',
    name: 'Caisse principale',
    class: '5',
    type: 'ASSET',
    parentId: '7',
    level: 2,
    isAuxiliary: false,
    isReconcilable: true,
    isActive: true,
    entity: 'default',
    createdAt: new Date(),
    createdBy: 'system'
  }
];

export const useChartOfAccounts = (): UseChartOfAccountsReturn => {
  const [accounts, setAccounts] = useState<ChartAccount[]>(mockAccounts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Créer un nouveau compte
  const createAccount = useCallback(async (
    accountData: Omit<ChartAccount, 'id' | 'createdAt' | 'createdBy'>
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validation SYSCOHADA basique
      if (!accountData.code.match(/^\d{2,6}$/)) {
        throw new Error('Le code compte doit contenir entre 2 et 6 chiffres');
      }

      if (accounts.find(acc => acc.code === accountData.code)) {
        throw new Error('Un compte avec ce code existe déjà');
      }

      const newAccount: ChartAccount = {
        ...accountData,
        id: `acc-${Date.now()}`,
        createdAt: new Date(),
        createdBy: 'current-user'
      };

      setAccounts(prev => [...prev, newAccount]);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du compte');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [accounts]);

  // Modifier un compte
  const updateAccount = useCallback(async (id: string, updates: Partial<ChartAccount>) => {
    setLoading(true);
    try {
      setAccounts(prev => prev.map(acc => 
        acc.id === id ? { ...acc, ...updates } : acc
      ));
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      setError('Erreur lors de la modification du compte');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Désactiver un compte
  const deleteAccount = useCallback(async (id: string) => {
    setLoading(true);
    try {
      // Vérifier si le compte a des transactions
      const hasTransactions = false; // À implémenter avec le module des transactions
      
      if (hasTransactions) {
        throw new Error('Impossible de supprimer un compte avec des transactions');
      }

      setAccounts(prev => prev.map(acc => 
        acc.id === id ? { ...acc, isActive: false } : acc
      ));
      
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Valider la conformité SYSCOHADA
  const validateSYSCOHADA = useCallback((account: ChartAccount) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validation du format du code
    if (!account.code.match(/^\d{2,6}$/)) {
      errors.push('Le code compte doit contenir uniquement des chiffres (2-6 caractères)');
    }

    // Validation de la classe
    const firstDigit = account.code.charAt(0);
    if (account.class !== firstDigit) {
      errors.push(`Le code compte ${account.code} ne correspond pas à la classe ${account.class}`);
    }

    // Validation de la hiérarchie
    if (account.parentId) {
      const parent = accounts.find(acc => acc.id === account.parentId);
      if (parent && account.code.length <= parent.code.length) {
        errors.push('Le code du compte enfant doit être plus long que celui du parent');
      }
    }

    // Vérification des comptes obligatoires SYSCOHADA
    const mandatoryAccounts = ['10', '41', '51', '57', '60', '70'];
    if (mandatoryAccounts.includes(account.code) && !account.isActive) {
      warnings.push(`Le compte ${account.code} est un compte obligatoire SYSCOHADA`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      classRules: [
        {
          class: '1' as const,
          minCode: '10',
          maxCode: '19',
          description: 'Ressources durables - Capital, réserves, emprunts'
        },
        {
          class: '2' as const,
          minCode: '20',
          maxCode: '29',
          description: 'Actif immobilisé - Immobilisations, amortissements'
        },
        {
          class: '4' as const,
          minCode: '40',
          maxCode: '49',
          description: 'Tiers - Clients, fournisseurs, personnel'
        },
        {
          class: '5' as const,
          minCode: '50',
          maxCode: '59',
          description: 'Trésorerie - Banques, caisse, placements'
        }
      ]
    };
  }, [accounts]);

  // Rechercher des comptes
  const searchAccounts = useCallback((query: string) => {
    return accounts.filter(acc => 
      acc.code.includes(query) || 
      acc.name.toLowerCase().includes(query.toLowerCase()) ||
      acc.description?.toLowerCase().includes(query.toLowerCase())
    );
  }, [accounts]);

  // Obtenir la hiérarchie des comptes
  const getAccountHierarchy = useCallback(() => {
    const hierarchy: { [key: string]: ChartAccount[] } = {};
    
    accounts.forEach(account => {
      if (!account.parentId) {
        if (!hierarchy[account.id]) {
          hierarchy[account.id] = [];
        }
      } else {
        if (!hierarchy[account.parentId]) {
          hierarchy[account.parentId] = [];
        }
        hierarchy[account.parentId].push(account);
      }
    });

    return hierarchy;
  }, [accounts]);

  return {
    accounts,
    loading,
    error,
    createAccount,
    updateAccount,
    deleteAccount,
    validateSYSCOHADA,
    searchAccounts,
    getAccountHierarchy
  };
};