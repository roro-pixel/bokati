import { useCallback } from 'react';
import { ChartAccount } from '../../../types';

export interface SYSCOHADAComplianceReport {
  isCompliant: boolean;
  score: number;
  checks: {
    structure: boolean;
    mandatoryAccounts: boolean;
    numbering: boolean;
    hierarchy: boolean;
    naming: boolean;
  };
  details: {
    missingAccounts: string[];
    structureErrors: string[];
    numberingErrors: string[];
    hierarchyErrors: string[];
    namingWarnings: string[];
  };
  recommendations: string[];
}

export const useSYSCOHADACompliance = () => {
  // Règles de nommage SYSCOHADA
  const namingConventions = {
    '10': 'CAPITAL',
    '11': 'RÉSERVES',
    '12': 'REPORT À NOUVEAU',
    '13': 'RÉSULTAT NET',
    '16': 'EMPRUNTS ET DETTES ASSIMILÉES',
    '21': 'IMMOBILISATIONS INCORPORELLES',
    '22': 'TERRAINS',
    '23': 'BÂTIMENTS',
    '24': 'MATÉRIEL',
    '28': 'AMORTISSEMENTS',
    '31': 'MARCHANDISES',
    '32': 'MATIÈRES PREMIÈRES',
    '40': 'FOURNISSEURS',
    '41': 'CLIENTS',
    '42': 'PERSONNEL',
    '44': 'ÉTAT ET COLLECTIVITÉS',
    '51': 'VALEURS À ENCAISSER',
    '52': 'BANQUES',
    '57': 'CAISSE',
    '60': 'ACHATS',
    '61': 'TRANSPORTS',
    '62': 'SERVICES EXTÉRIEURS',
    '63': 'IMPÔTS ET TAXES',
    '64': 'CHARGES DE PERSONNEL',
    '68': 'DOTATIONS AUX AMORTISSEMENTS',
    '70': 'VENTES',
    '71': 'SUBVENTIONS D\'EXPLOITATION',
    '75': 'PRODUITS DE CESSIONS',
    '78': 'REPRISES D\'AMORTISSEMENTS'
  };

  // Vérifier la conformité SYSCOHADA complète
  const checkCompliance = useCallback((accounts: ChartAccount[]): SYSCOHADAComplianceReport => {
    const details = {
      missingAccounts: [] as string[],
      structureErrors: [] as string[],
      numberingErrors: [] as string[],
      hierarchyErrors: [] as string[],
      namingWarnings: [] as string[]
    };

    let passedChecks = 0;
    const totalChecks = 5;

    // Check 1: Structure de base
    const hasAllClasses = [1, 2, 3, 4, 5, 6, 7, 8, 9].every(classNum => 
      accounts.some(acc => acc.class === classNum.toString())
    );
    
    if (hasAllClasses) {
      passedChecks++;
    } else {
      details.structureErrors.push('Toutes les classes comptables (1-9) ne sont pas représentées');
    }

    // Check 2: Comptes obligatoires
    const mandatoryAccounts = Object.keys(namingConventions);
    const missingMandatory = mandatoryAccounts.filter(code => 
      !accounts.some(acc => acc.code === code && acc.isActive)
    );
    
    if (missingMandatory.length === 0) {
      passedChecks++;
    } else {
      details.missingAccounts.push(...missingMandatory);
    }

    // Check 3: Numérotation
    const numberingValid = accounts.every(acc => {
      const code = acc.code;
      const firstDigit = code.charAt(0);
      
      // Vérifier que le code commence par le bon chiffre de classe
      if (acc.class !== firstDigit) {
        details.numberingErrors.push(`Compte ${code}: la classe ${acc.class} ne correspond pas au code`);
        return false;
      }

      // Vérifier la longueur du code
      if (code.length < 2 || code.length > 6) {
        details.numberingErrors.push(`Compte ${code}: longueur invalide (2-6 chiffres requis)`);
        return false;
      }

      return true;
    });

    if (numberingValid) {
      passedChecks++;
    }

    // Check 4: Hiérarchie
    const hierarchyValid = accounts.every(account => {
      if (account.parentId) {
        const parent = accounts.find(acc => acc.id === account.parentId);
        if (!parent) {
          details.hierarchyErrors.push(`Compte ${account.code}: parent ${account.parentId} introuvable`);
          return false;
        }
        if (account.code.length <= parent.code.length) {
          details.hierarchyErrors.push(`Compte ${account.code}: code plus court ou égal au parent ${parent.code}`);
          return false;
        }
      }
      return true;
    });

    if (hierarchyValid) {
      passedChecks++;
    }

    // Check 5: Nommage
    const namingValid = accounts.every(account => {
      const expectedName = namingConventions[account.code as keyof typeof namingConventions];
      if (expectedName && account.name !== expectedName) {
        details.namingWarnings.push(`Compte ${account.code}: nom "${account.name}" diffère du nom standard "${expectedName}"`);
      }
      return true; // Le nommage est un warning, pas une erreur bloquante
    });

    if (namingValid) {
      passedChecks++;
    }

    // Générer les recommandations
    const recommendations: string[] = [];
    
    if (missingMandatory.length > 0) {
      recommendations.push(`Ajouter les comptes obligatoires manquants: ${missingMandatory.join(', ')}`);
    }

    if (details.namingWarnings.length > 0) {
      recommendations.push('Standardiser les noms de comptes selon la nomenclature SYSCOHADA');
    }

    if (!hasAllClasses) {
      recommendations.push('Compléter le plan comptable avec toutes les classes SYSCOHADA');
    }

    const score = Math.round((passedChecks / totalChecks) * 100);

    return {
      isCompliant: passedChecks === totalChecks,
      score,
      checks: {
        structure: hasAllClasses,
        mandatoryAccounts: missingMandatory.length === 0,
        numbering: numberingValid,
        hierarchy: hierarchyValid,
        naming: namingValid
      },
      details,
      recommendations
    };
  }, []);

  // Vérifier la conformité d'un compte individuel
  const checkAccountCompliance = useCallback((account: ChartAccount) => {
    const issues: string[] = [];
    const warnings: string[] = [];

    // Vérifier le nom standard
    const expectedName = namingConventions[account.code as keyof typeof namingConventions];
    if (expectedName && account.name !== expectedName) {
      warnings.push(`Nom non standard: "${account.name}" au lieu de "${expectedName}"`);
    }

    // Vérifier la classe
    const firstDigit = account.code.charAt(0);
    if (account.class !== firstDigit) {
      issues.push(`Classe ${account.class} incompatible avec le code ${account.code}`);
    }

    // Vérifier le type de compte selon la classe
    const classRules = {
      '1': ['EQUITY', 'LIABILITY'],
      '2': ['ASSET'],
      '3': ['ASSET'],
      '4': ['ASSET', 'LIABILITY'],
      '5': ['ASSET'],
      '6': ['EXPENSE'],
      '7': ['INCOME'],
      '8': ['EXPENSE', 'INCOME'],
      '9': ['EXPENSE', 'INCOME']
    };

    const allowedTypes = classRules[account.class as keyof typeof classRules];
    if (allowedTypes && !allowedTypes.includes(account.type)) {
      issues.push(`Type "${account.type}" non autorisé pour la classe ${account.class}`);
    }

    return {
      isCompliant: issues.length === 0,
      issues,
      warnings,
      expectedName
    };
  }, []);

  // Générer un rapport de conformité détaillé
  const generateComplianceReport = useCallback((accounts: ChartAccount[]) => {
    const compliance = checkCompliance(accounts);
    
    const report = {
      ...compliance,
      statistics: {
        totalAccounts: accounts.length,
        activeAccounts: accounts.filter(acc => acc.isActive).length,
        accountsByClass: {} as { [key: string]: number },
        auxiliaryAccounts: accounts.filter(acc => acc.isAuxiliary).length,
        reconcilableAccounts: accounts.filter(acc => acc.isReconcilable).length
      },
      timeline: new Date().toISOString()
    };

    // Compter les comptes par classe
    for (let i = 1; i <= 9; i++) {
      report.statistics.accountsByClass[i.toString()] = 
        accounts.filter(acc => acc.class === i.toString()).length;
    }

    return report;
  }, [checkCompliance]);

  // Exporter le plan comptable au format SYSCOHADA standard
  const exportSYSCOHADAFormat = useCallback((accounts: ChartAccount[]) => {
    const sortedAccounts = [...accounts].sort((a, b) => a.code.localeCompare(b.code));
    
    const exportData = sortedAccounts.map(account => ({
      Code: account.code,
      Classe: account.class,
      'Type Compte': account.type,
      'Nom Compte': account.name,
      'Compte Auxiliaire': account.isAuxiliary ? 'Oui' : 'Non',
      'Compte Rapprochable': account.isReconcilable ? 'Oui' : 'Non',
      Statut: account.isActive ? 'Actif' : 'Inactif',
      'Compte Parent': account.parentId || '',
      Description: account.description || ''
    }));

    return exportData;
  }, []);

  return {
    checkCompliance,
    checkAccountCompliance,
    generateComplianceReport,
    exportSYSCOHADAFormat,
    namingConventions
  };
};