import { useState, useCallback } from 'react';
import { FinancialStatement, BalanceSheetData, IncomeStatementData, CashFlowData } from '../../../types';

export const useFinancialReports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulation de données mock pour les états financiers
  const mockBalanceSheetData: BalanceSheetData = {
    actif: {
      immobilise: {
        fraisEtablissement: 50000,
        chargesRepartir: 30000,
        primesRemboursement: 20000,
        immobilisationsIncorporelles: 150000,
        immobilisationsCorporelles: 450000,
        avancesAcomptes: 75000,
        immobilisationsFinancieres: 120000
      },
      circulant: {
        stocks: 180000,
        creancesEmploisAssimiles: 220000,
        tresorerieActif: 95000
      }
    },
    passif: {
      ressourcesDurables: {
        capital: 500000,
        primesReserves: 150000,
        resultatNet: 30000,
        autresCapitauxPropres: 45000,
        dettesFinancieres: 180000,
        provisionsRisquesCharges: 35000
      },
      circulant: {
        dettesCirculantes: 165000,
        tresoreriePassif: 25000
      }
    }
  };

  const mockIncomeStatementData: IncomeStatementData = {
    charges: {
      exploitation: {
        achatsMarchandises: 450000,
        variationStocksMarchandises: -15000,
        achatsMatièresPremieres: 280000,
        variationStocksMatieres: -8000,
        autresAchats: 120000,
        variationStocksAutres: -3000,
        transports: 45000,
        servicesExterieurs: 88000,
        impotsTaxes: 35000,
        autresCharges: 42000
      },
      financieres: 25000,
      hao: 15000,
      participationTravailleurs: 18000,
      impotsResultat: 45000
    },
    produits: {
      exploitation: {
        ventesMarchandises: 850000,
        ventesProduitsFabriques: 320000,
        travauxServicesVendus: 150000,
        productionStockee: 45000,
        productionImmobilisee: 28000,
        subventionsExploitation: 15000,
        autresProduits: 32000,
        reprisesProvisions: 12000
      },
      financiers: 18000,
      hao: 8000
    },
    soldesIntermediaires: {
      margeCommerciale: 415000,
      valeurAjoutee: 285000,
      ebe: 152000,
      resultatExploitation: 88000,
      resultatFinancier: -7000,
      resultatActivitesOrdinaires: 81000,
      resultatHAO: -7000,
      resultatNet: 74000
    }
  };

  const mockCashFlowData: CashFlowData = {
    activites: {
      exploitation: 125000,
      investissement: -75000,
      financement: -25000
    },
    variationTresorerie: 25000,
    soldeOuverture: 70000,
    soldeCloture: 95000
  };

  const generateBalanceSheet = useCallback(async (periodId: string): Promise<FinancialStatement> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statement: FinancialStatement = {
        id: `BS-${Date.now()}`,
        type: 'BALANCE_SHEET',
        periodId,
        entity: 'ENT001',
        generatedAt: new Date(),
        generatedBy: 'user001',
        data: mockBalanceSheetData
      };
      
      return statement;
    } catch (err) {
      setError('Erreur lors de la génération du bilan');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateIncomeStatement = useCallback(async (periodId: string): Promise<FinancialStatement> => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statement: FinancialStatement = {
        id: `IS-${Date.now()}`,
        type: 'INCOME_STATEMENT',
        periodId,
        entity: 'ENT001',
        generatedAt: new Date(),
        generatedBy: 'user001',
        data: mockIncomeStatementData
      };
      
      return statement;
    } catch (err) {
      setError('Erreur lors de la génération du compte de résultat');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateCashFlow = useCallback(async (periodId: string): Promise<FinancialStatement> => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statement: FinancialStatement = {
        id: `CF-${Date.now()}`,
        type: 'CASH_FLOW',
        periodId,
        entity: 'ENT001',
        generatedAt: new Date(),
        generatedBy: 'user001',
        data: mockCashFlowData
      };
      
      return statement;
    } catch (err) {
      setError('Erreur lors de la génération du tableau de flux de trésorerie');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const exportToPDF = useCallback(async (statement: FinancialStatement, format: 'A4' | 'A3' = 'A4'): Promise<void> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Export ${statement.type} en format ${format}`, statement);
      // Simulation d'export PDF
      alert(`Export PDF ${statement.type} généré avec succès!`);
    } catch (err) {
      setError('Erreur lors de l\'export PDF');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const exportToExcel = useCallback(async (statement: FinancialStatement): Promise<void> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Export ${statement.type} vers Excel`, statement);
      // Simulation d'export Excel
      alert(`Export Excel ${statement.type} généré avec succès!`);
    } catch (err) {
      setError('Erreur lors de l\'export Excel');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    generateBalanceSheet,
    generateIncomeStatement,
    generateCashFlow,
    exportToPDF,
    exportToExcel
  };
};