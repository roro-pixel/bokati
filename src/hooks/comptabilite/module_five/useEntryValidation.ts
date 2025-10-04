import { useCallback } from 'react';
import { JournalEntry, EntryValidationResult, JournalEntryLine } from '../../../types';

export const useEntryValidation = () => {
  // Valider une ligne d'écriture
  const validateLine = useCallback((line: JournalEntryLine): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!line.accountId) {
      errors.push('Compte requis');
    }

    if (line.amount <= 0) {
      errors.push('Le montant doit être positif');
    }

    if (!line.description?.trim()) {
      errors.push('Description requise');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // Valider une écriture complète
  const validateEntry = useCallback((entry: JournalEntry): EntryValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validation de base
    if (!entry.journalId) {
      errors.push('Journal requis');
    }

    if (!entry.description?.trim()) {
      errors.push('Description de l\'écriture requise');
    }

    if (entry.entryDate > new Date()) {
      errors.push('Date d\'écriture ne peut pas être dans le futur');
    }

    // Validation des lignes
    entry.lines.forEach((line, index) => {
      const lineValidation = validateLine(line);
      if (!lineValidation.isValid) {
        errors.push(`Ligne ${index + 1}: ${lineValidation.errors.join(', ')}`);
      }
    });

    // Équilibre débit/crédit
    const totalDebit = entry.lines
      .filter(line => line.type === 'DEBIT')
      .reduce((sum, line) => sum + line.amount, 0);
    
    const totalCredit = entry.lines
      .filter(line => line.type === 'CREDIT')
      .reduce((sum, line) => sum + line.amount, 0);

    const balanceDifference = Math.abs(totalDebit - totalCredit);
    const isBalanced = balanceDifference < 0.01; // Tolérance pour les arrondis

    if (!isBalanced) {
      errors.push(`Écriture déséquilibrée: Différence de ${balanceDifference.toFixed(2)} FCFA`);
    }

    // Règles SYSCOHADA
    if (entry.lines.length < 2) {
      errors.push('Une écriture doit avoir au moins 2 lignes');
    }

    // Vérification de la séquence numérique (à implémenter avec le module de séquences)
    if (!entry.entryNumber) {
      warnings.push('Numéro d\'écriture non attribué');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      balanceCheck: {
        isBalanced,
        debitTotal: totalDebit,
        creditTotal: totalCredit,
        difference: balanceDifference
      },
      periodCheck: {
        isOpen: true, // À intégrer avec le module des périodes
        periodId: 'current' // À remplacer
      },
      accountChecks: {
        validAccounts: entry.lines.every(line => line.accountId),
        activeAccounts: true, // À intégrer avec le plan comptable
        SYSCOHADACompliant: true // À implémenter avec les règles SYSCOHADA
      }
    };
  }, [validateLine]);

  // Valider le workflow d'approbation
  const validateApprovalWorkflow = useCallback((entry: JournalEntry, amountThresholds: { [key: number]: number }) => {
    const totalAmount = Math.max(entry.totalDebit, entry.totalCredit);
    const requiredLevels: number[] = [];

    Object.entries(amountThresholds)
      .sort(([a], [b]) => Number(a) - Number(b))
      .forEach(([level, threshold]) => {
        if (totalAmount > threshold) {
          requiredLevels.push(Number(level));
        }
      });

    return {
      requiredLevels,
      totalAmount,
      highestLevel: requiredLevels.length > 0 ? Math.max(...requiredLevels) : 0
    };
  }, []);

  return {
    validateLine,
    validateEntry,
    validateApprovalWorkflow
  };
};