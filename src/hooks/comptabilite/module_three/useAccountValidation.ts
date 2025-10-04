import { useCallback } from 'react';
import { ChartAccount, AccountClass, AccountType } from '../../../types';

export interface AccountValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export const useAccountValidation = () => {
  // Règles SYSCOHADA par classe
  const classRules = {
    '1': { 
      type: ['EQUITY', 'LIABILITY'] as AccountType[],
      description: 'Ressources durables - Capital, réserves, emprunts',
      minCode: '10',
      maxCode: '19'
    },
    '2': { 
      type: ['ASSET'] as AccountType[],
      description: 'Actif immobilisé - Immobilisations, amortissements',
      minCode: '20',
      maxCode: '29'
    },
    '3': { 
      type: ['ASSET'] as AccountType[],
      description: 'Stocks - Marchandises, matières premières',
      minCode: '30',
      maxCode: '39'
    },
    '4': { 
      type: ['ASSET', 'LIABILITY'] as AccountType[],
      description: 'Tiers - Clients, fournisseurs, personnel',
      minCode: '40',
      maxCode: '49'
    },
    '5': { 
      type: ['ASSET'] as AccountType[],
      description: 'Trésorerie - Banques, caisse, placements',
      minCode: '50',
      maxCode: '59'
    },
    '6': { 
      type: ['EXPENSE'] as AccountType[],
      description: 'Charges - Achats, services, personnel',
      minCode: '60',
      maxCode: '69'
    },
    '7': { 
      type: ['INCOME'] as AccountType[],
      description: 'Produits - Ventes, subventions, production',
      minCode: '70',
      maxCode: '79'
    },
    '8': { 
      type: ['EXPENSE', 'INCOME'] as AccountType[],
      description: 'Autres charges et produits - HAO, participations',
      minCode: '80',
      maxCode: '89'
    },
    '9': { 
      type: ['EXPENSE', 'INCOME'] as AccountType[],
      description: 'Comptabilité analytique - Sections analytiques',
      minCode: '90',
      maxCode: '99'
    }
  };

  // Comptes obligatoires SYSCOHADA
  const mandatoryAccounts = [
    '10', // Capital
    '11', // Réserves
    '16', // Emprunts
    '21', // Immobilisations incorporelles
    '22', // Terrains
    '23', // Bâtiments
    '24', // Matériel
    '28', // Amortissements
    '31', // Marchandises
    '32', // Matières premières
    '40', // Fournisseurs
    '41', // Clients
    '42', // Personnel
    '44', // État
    '51', // Valeurs à encaisser
    '52', // Banques
    '57', // Caisse
    '60', // Achats
    '61', // Transports
    '62', // Services extérieurs
    '63', // Impôts et taxes
    '64', // Charges de personnel
    '68', // Dotations aux amortissements
    '70', // Ventes
    '71', // Subventions
    '75', // Produits de cessions
    '78'  // Reprises d'amortissements
  ];

  // Valider un compte individuel
  const validateAccount = useCallback((account: ChartAccount): AccountValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Validation du code
    if (!account.code.match(/^\d{2,6}$/)) {
      errors.push('Le code compte doit contenir entre 2 et 6 chiffres');
    }

    // Validation de la classe
    const firstDigit = account.code.charAt(0);
    if (account.class !== firstDigit) {
      errors.push(`Le code ${account.code} ne correspond pas à la classe ${account.class}`);
    }

    // Validation du type de compte selon la classe
    const rule = classRules[account.class as AccountClass];
    if (rule && !rule.type.includes(account.type)) {
      errors.push(`La classe ${account.class} ne peut contenir que des comptes de type: ${rule.type.join(', ')}`);
    }

    // Validation de la plage de codes
    if (rule) {
      const codeNum = parseInt(account.code);
      const minNum = parseInt(rule.minCode);
      const maxNum = parseInt(rule.maxCode);
      
      if (codeNum < minNum || codeNum > maxNum) {
        errors.push(`Le code ${account.code} est en dehors de la plage autorisée pour la classe ${account.class} (${rule.minCode}-${rule.maxCode})`);
      }
    }

    // Validation du nom
    if (!account.name || account.name.trim().length === 0) {
      errors.push('Le nom du compte est requis');
    }

    if (account.name.length > 100) {
      warnings.push('Le nom du compte est trop long (max 100 caractères)');
    }

    // Vérification des comptes obligatoires
    if (mandatoryAccounts.includes(account.code) && !account.isActive) {
      warnings.push(`Attention: Le compte ${account.code} est un compte obligatoire SYSCOHADA`);
    }

    // Suggestions pour les comptes auxiliaires
    if (account.class === '4' && !account.isAuxiliary) {
      suggestions.push('Les comptes de classe 4 (Tiers) devraient généralement être marqués comme auxiliaires');
    }

    // Suggestions pour les comptes de trésorerie
    if ((account.code.startsWith('5') && account.code !== '59') && !account.isReconcilable) {
      suggestions.push('Les comptes de trésorerie (classe 5) devraient généralement être rapprochables');
    }

    // Validation de la hiérarchie
    if (account.parentId) {
      const codeLength = account.code.length;
      if (codeLength < 3) {
        errors.push('Les comptes enfants doivent avoir au moins 3 chiffres');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }, []);

  // Valider la structure complète du plan comptable
  const validateChartStructure = useCallback((accounts: ChartAccount[]) => {
    const structureErrors: string[] = [];
    const missingAccounts: string[] = [];

    // Vérifier les comptes obligatoires
    mandatoryAccounts.forEach(mandatoryCode => {
      const exists = accounts.some(acc => 
        acc.code === mandatoryCode && acc.isActive
      );
      if (!exists) {
        missingAccounts.push(mandatoryCode);
      }
    });

    if (missingAccounts.length > 0) {
      structureErrors.push(`Comptes obligatoires SYSCOHADA manquants: ${missingAccounts.join(', ')}`);
    }

    // Vérifier la cohérence de la hiérarchie
    accounts.forEach(account => {
      if (account.parentId) {
        const parent = accounts.find(acc => acc.id === account.parentId);
        if (!parent) {
          structureErrors.push(`Compte ${account.code} a un parent invalide`);
        } else if (account.code.length <= parent.code.length) {
          structureErrors.push(`Compte ${account.code} doit avoir un code plus long que son parent ${parent.code}`);
        }
      }
    });

    // Vérifier les doublons
    const codeCounts: { [code: string]: number } = {};
    accounts.forEach(account => {
      codeCounts[account.code] = (codeCounts[account.code] || 0) + 1;
    });

    Object.entries(codeCounts).forEach(([code, count]) => {
      if (count > 1) {
        structureErrors.push(`Code dupliqué: ${code} (${count} occurrences)`);
      }
    });

    return {
      isValid: structureErrors.length === 0,
      errors: structureErrors,
      missingAccounts,
      totalAccounts: accounts.length,
      activeAccounts: accounts.filter(acc => acc.isActive).length
    };
  }, []);

  // Générer le prochain code enfant pour un parent
  const generateChildCode = useCallback((parentCode: string, existingChildren: ChartAccount[]) => {
    const parentLevel = parentCode.length;
    const childLevel = parentLevel + 1;
    
    // Trouver le prochain numéro disponible
    const childCodes = existingChildren
      .map(acc => acc.code)
      .filter(code => code.startsWith(parentCode) && code.length === childLevel)
      .map(code => parseInt(code.slice(parentLevel)))
      .filter(num => !isNaN(num))
      .sort((a, b) => a - b);

    let nextNumber = 1;
    for (const num of childCodes) {
      if (num === nextNumber) {
        nextNumber++;
      } else {
        break;
      }
    }

    return parentCode + nextNumber.toString().padStart(childLevel - parentLevel, '0');
  }, []);

  // Vérifier si un compte peut être désactivé
  const canDeactivateAccount = useCallback((account: ChartAccount, allAccounts: ChartAccount[]) => {
    const reasons: string[] = [];

    // Vérifier les comptes obligatoires
    if (mandatoryAccounts.includes(account.code)) {
      reasons.push('Ce compte est obligatoire selon SYSCOHADA');
    }

    // Vérifier les comptes enfants actifs
    const activeChildren = allAccounts.filter(acc => 
      acc.parentId === account.id && acc.isActive
    );
    if (activeChildren.length > 0) {
      reasons.push(`Le compte a ${activeChildren.length} compte(s) enfant(s) actif(s)`);
    }

    // Vérifier s'il a des transactions (à implémenter avec le module des transactions)
    const hasTransactions = false; // Placeholder
    if (hasTransactions) {
      reasons.push('Le compte a des transactions associées');
    }

    return {
      canDeactivate: reasons.length === 0,
      reasons
    };
  }, []);

  return {
    validateAccount,
    validateChartStructure,
    generateChildCode,
    canDeactivateAccount,
    classRules,
    mandatoryAccounts
  };
};