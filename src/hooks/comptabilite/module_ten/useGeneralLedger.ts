import { useState, useCallback } from 'react';
import { GeneralLedgerReport, ReportFilter, GeneralLedgerEntry } from '../../../types';

export const useGeneralLedger = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Données mock pour le Grand Livre
  const mockGeneralLedgerData: GeneralLedgerReport[] = [
    {
      accountCode: '701000',
      accountName: 'Ventes de marchandises',
      openingDebit: 0,
      openingCredit: 1500000,
      totalDebit: 0,
      totalCredit: 450000,
      closingDebit: 0,
      closingCredit: 1950000,
      entries: [
        {
          id: '1',
          entryId: 'TRX-001',
          entryNumber: 'VTE-2024-0001',
          entryDate: new Date('2024-06-15'),
          journalCode: 'VTE',
          accountCode: '701000',
          accountName: 'Ventes de marchandises',
          description: 'Vente client ABC',
          debit: 0,
          credit: 1500000,
          balance: -1500000,
          status: 'POSTED'
        },
        {
          id: '2',
          entryId: 'TRX-002',
          entryNumber: 'VTE-2024-0002',
          entryDate: new Date('2024-06-20'),
          journalCode: 'VTE',
          accountCode: '701000',
          accountName: 'Ventes de marchandises',
          description: 'Vente client XYZ',
          debit: 0,
          credit: 450000,
          balance: -1950000,
          status: 'POSTED'
        }
      ]
    },
    {
      accountCode: '411000',
      accountName: 'Clients',
      openingDebit: 800000,
      openingCredit: 0,
      totalDebit: 1950000,
      totalCredit: 0,
      closingDebit: 2750000,
      closingCredit: 0,
      entries: [
        {
          id: '3',
          entryId: 'TRX-001',
          entryNumber: 'VTE-2024-0001',
          entryDate: new Date('2024-06-15'),
          journalCode: 'VTE',
          accountCode: '411000',
          accountName: 'Clients',
          description: 'Vente client ABC',
          debit: 1500000,
          credit: 0,
          balance: 1500000,
          status: 'POSTED'
        },
        {
          id: '4',
          entryId: 'TRX-002',
          entryNumber: 'VTE-2024-0002',
          entryDate: new Date('2024-06-20'),
          journalCode: 'VTE',
          accountCode: '411000',
          accountName: 'Clients',
          description: 'Vente client XYZ',
          debit: 450000,
          credit: 0,
          balance: 1950000,
          status: 'POSTED'
        }
      ]
    }
  ];

  const generateGeneralLedger = useCallback(async (filter: ReportFilter): Promise<GeneralLedgerReport[]> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Filtrage simulé basé sur les paramètres
      let filteredData = [...mockGeneralLedgerData];
      
      if (filter.accountCodes && filter.accountCodes.length > 0) {
        filteredData = filteredData.filter(account => 
          filter.accountCodes!.includes(account.accountCode)
        );
      }
      
      return filteredData;
    } catch (err) {
      setError('Erreur lors de la génération du Grand Livre');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const exportGeneralLedger = useCallback(async (data: GeneralLedgerReport[], format: 'PDF' | 'EXCEL'): Promise<void> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Export Grand Livre en ${format}`, data);
      alert(`Grand Livre exporté en ${format} avec succès!`);
    } catch (err) {
      setError(`Erreur lors de l'export ${format}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    generateGeneralLedger,
    exportGeneralLedger
  };
};