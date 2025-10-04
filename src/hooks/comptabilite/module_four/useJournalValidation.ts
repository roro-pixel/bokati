import { useCallback } from 'react';
import { Journal, JournalType } from '../../../types';

export interface JournalValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const useJournalValidation = () => {
  // Règles de validation par type de journal
  const journalRules = {
    'GEN': {
      name: 'Journal Général',
      description: 'Transactions diverses et écritures de régularisation',
      allowedAccounts: ['all'],
      requiresApproval: true
    },
    'VTE': {
      name: 'Journal des Ventes', 
      description: 'Transactions clients et ventes',
      allowedAccounts: ['411000', '701000', '445660', '512000', '571000'],
      requiresApproval: false
    },
    'ACH': {
      name: 'Journal des Achats',
      description: 'Transactions fournisseurs et achats',
      allowedAccounts: ['401000', '601000', '602000', '445670', '512000', '571000'],
      requiresApproval: true
    },
    'BNQ': {
      name: 'Journal de Banque',
      description: 'Transactions bancaires',
      allowedAccounts: ['512000', '571000', '411000', '401000', '445660', '445670'],
      requiresApproval: false
    },
    'CAI': {
      name: 'Journal de Caisse',
      description: 'Transactions de caisse',
      allowedAccounts: ['571000', '512000', '411000', '401000'],
      requiresApproval: false
    }
  };

  // Valider un journal
  const validateJournal = useCallback((journal: Journal): JournalValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validation du code
    if (!journal.code || journal.code.length !== 3) {
      errors.push('Le code journal doit contenir exactement 3 caractères');
    }

    if (!journal.code.match(/^[A-Z]{3}$/)) {
      errors.push('Le code journal doit contenir uniquement des lettres majuscules');
    }

    // Validation du nom
    if (!journal.name || journal.name.trim().length === 0) {
      errors.push('Le nom du journal est requis');
    }

    if (journal.name.length > 50) {
      warnings.push('Le nom du journal est trop long (max 50 caractères)');
    }

    // Validation du type
    const rule = journalRules[journal.type];
    if (!rule) {
      errors.push(`Type de journal invalide: ${journal.type}`);
    }

    // Validation de la cohérence type/code
    if (journal.code !== journal.type) {
      warnings.push(`Le code journal (${journal.code}) ne correspond pas au type (${journal.type})`);
    }

    // Validation des comptes par défaut
    if (journal.defaultAccounts) {
      Object.entries(journal.defaultAccounts).forEach(([key, accountCode]) => {
        if (accountCode && rule && rule.allowedAccounts[0] !== 'all') {
          if (!rule.allowedAccounts.includes(accountCode)) {
            warnings.push(`Le compte ${accountCode} n'est pas typique pour un journal ${journal.type}`);
          }
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }, []);

  // Valider qu'un compte peut être utilisé dans un journal
  const validateAccountForJournal = useCallback((journalType: JournalType, accountCode: string): boolean => {
    const rule = journalRules[journalType];
    if (!rule) return false;
    
    return rule.allowedAccounts[0] === 'all' || rule.allowedAccounts.includes(accountCode);
  }, []);

  // Obtenir les comptes suggérés pour un type de journal
  const getSuggestedAccounts = useCallback((journalType: JournalType) => {
    const rule = journalRules[journalType];
    if (!rule) return [];

    const accountSuggestions = {
      'GEN': [
        { code: '101000', name: 'Capital social' },
        { code: '281000', name: 'Amortissements' },
        { code: '681000', name: 'Dotations aux amortissements' }
      ],
      'VTE': [
        { code: '411000', name: 'Clients' },
        { code: '701000', name: 'Ventes de marchandises' },
        { code: '445660', name: 'TVA collectée' },
        { code: '512000', name: 'Banque' }
      ],
      'ACH': [
        { code: '401000', name: 'Fournisseurs' },
        { code: '601000', name: 'Achats de marchandises' },
        { code: '445670', name: 'TVA déductible' },
        { code: '512000', name: 'Banque' }
      ],
      'BNQ': [
        { code: '512000', name: 'Banque' },
        { code: '571000', name: 'Caisse' },
        { code: '411000', name: 'Clients' },
        { code: '401000', name: 'Fournisseurs' }
      ],
      'CAI': [
        { code: '571000', name: 'Caisse' },
        { code: '512000', name: 'Banque' },
        { code: '411000', name: 'Clients' },
        { code: '401000', name: 'Fournisseurs' }
      ]
    };

    return accountSuggestions[journalType] || [];
  }, []);

  // Vérifier si un journal peut être désactivé
  const canDeactivateJournal = useCallback((journalId: string, journalStatus: any[]) => {
    const status = journalStatus.find(js => js.journalId === journalId);
    
    if (status && status.totalEntries > 0) {
      return {
        canDeactivate: false,
        reason: `Le journal a ${status.totalEntries} écritures et ne peut pas être désactivé`
      };
    }

    return { canDeactivate: true, reason: '' };
  }, []);

  return {
    validateJournal,
    validateAccountForJournal,
    getSuggestedAccounts,
    canDeactivateJournal,
    journalRules
  };
};