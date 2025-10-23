import { useState, useCallback } from 'react';
import { AnomalyReport, ReportFilter } from '../../../types';

export const useAnomalyReports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Données mock pour les anomalies
  const mockAnomalies: AnomalyReport[] = [
    {
      id: '1',
      type: 'UNBALANCED_ENTRY',
      severity: 'HIGH',
      description: 'Écriture déséquilibrée détectée',
      details: 'L\'écriture TRX-2024-001 présente un déséquilibre de 1 500 FCFA entre débit et crédit',
      affectedEntries: ['TRX-2024-001'],
      detectedAt: new Date('2024-06-15'),
      resolved: false
    },
    {
      id: '2',
      type: 'SUSPENSE_ACCOUNT',
      severity: 'MEDIUM',
      description: 'Compte d\'attente avec solde important',
      details: 'Le compte 471000 présente un solde de 25 000 FCFA depuis plus de 30 jours',
      affectedAccounts: ['471000'],
      detectedAt: new Date('2024-06-10'),
      resolved: false
    },
    {
      id: '3',
      type: 'INACTIVE_ACCOUNT',
      severity: 'LOW',
      description: 'Compte inactif utilisé dans une écriture',
      details: 'Le compte 101100 (inactif) a été utilisé dans l\'écriture TRX-2024-003',
      affectedEntries: ['TRX-2024-003'],
      affectedAccounts: ['101100'],
      detectedAt: new Date('2024-06-08'),
      resolved: true,
      resolvedAt: new Date('2024-06-09'),
      resolvedBy: 'user001'
    },
    {
      id: '4',
      type: 'PERIOD_CLOSED',
      severity: 'CRITICAL',
      description: 'Tentative de saisie sur période clôturée',
      details: 'L\'utilisateur user003 a tenté de saisir une écriture sur la période mars 2024 qui est clôturée',
      affectedEntries: ['TRX-2024-004'],
      detectedAt: new Date('2024-06-05'),
      resolved: false
    }
  ];

  const getAnomalies = useCallback(async (filter: ReportFilter): Promise<AnomalyReport[]> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredAnomalies = [...mockAnomalies];
      
      // Filtrage par période
      if (filter.startDate && filter.endDate) {
        filteredAnomalies = filteredAnomalies.filter(anomaly => 
          anomaly.detectedAt >= filter.startDate! && anomaly.detectedAt <= filter.endDate!
        );
      }
      
      // Filtrage par statut résolu/non résolu
      if (filter.includePostedOnly) { // Réutilisé pour "résolu seulement"
        filteredAnomalies = filteredAnomalies.filter(anomaly => anomaly.resolved);
      }
      
      return filteredAnomalies;
    } catch (err) {
      setError('Erreur lors de la récupération des anomalies');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resolveAnomaly = useCallback(async (anomalyId: string, resolvedBy: string): Promise<void> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Dans une vraie app, on appellerait l'API pour marquer comme résolu
      console.log(`Anomalie ${anomalyId} résolue par ${resolvedBy}`);
      
    } catch (err) {
      setError('Erreur lors de la résolution de l\'anomalie');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAnomalyStats = useCallback((): { total: number; resolved: number; critical: number; high: number } => {
    const total = mockAnomalies.length;
    const resolved = mockAnomalies.filter(a => a.resolved).length;
    const critical = mockAnomalies.filter(a => a.severity === 'CRITICAL' && !a.resolved).length;
    const high = mockAnomalies.filter(a => a.severity === 'HIGH' && !a.resolved).length;
    
    return { total, resolved, critical, high };
  }, []);

  const exportAnomalyReport = useCallback(async (anomalies: AnomalyReport[], format: 'PDF' | 'EXCEL'): Promise<void> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Export anomalies en ${format}`, anomalies);
      alert(`Rapport d'anomalies exporté en ${format} avec succès!`);
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
    getAnomalies,
    resolveAnomaly,
    getAnomalyStats,
    exportAnomalyReport
  };
};