import { useState, useCallback } from 'react';
import { ApprovalWorkflow, JournalEntry } from '../../../types';

export const useApprovalWorkflow = () => {
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>([]);
  const [loading, setLoading] = useState(false);

  // Seuils d'approbation par défaut (en FCFA)
  const defaultAmountThresholds = {
    1: 100000,   // Niveau 1: Manager - jusqu'à 100,000 FCFA
    2: 1000000,  // Niveau 2: CFO - jusqu'à 1,000,000 FCFA
    3: Infinity  // Niveau 3: CEO - au-dessus de 1,000,000 FCFA
  };

  // Déterminer les niveaux d'approbation requis
  const getRequiredApprovalLevels = useCallback((entry: JournalEntry, customThresholds?: { [key: number]: number }) => {
    const thresholds = customThresholds || defaultAmountThresholds;
    const totalAmount = Math.max(entry.totalDebit, entry.totalCredit);
    
    const requiredLevels: number[] = [];
    
    Object.entries(thresholds)
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

  // Créer un workflow d'approbation
  const createApprovalWorkflow = useCallback(async (entryId: string, requiredLevels: number[]) => {
    setLoading(true);
    try {
      const newWorkflows: ApprovalWorkflow[] = requiredLevels.map(level => ({
        id: `workflow-${entryId}-${level}-${Date.now()}`,
        entryId,
        level,
        approverId: '', // À assigner selon les règles métier
        status: 'PENDING',
        requiredAmount: defaultAmountThresholds[level] || 0,
        createdAt: new Date()
      }));

      setWorkflows(prev => [...prev, ...newWorkflows]);
      
      // Simuler appel API
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return newWorkflows;
    } catch (error) {
      console.error('Erreur création workflow:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Approuver un niveau
  const approveLevel = useCallback(async (workflowId: string, comments?: string) => {
    setLoading(true);
    try {
      setWorkflows(prev => prev.map(wf => 
        wf.id === workflowId 
          ? { 
              ...wf, 
              status: 'APPROVED', 
              comments,
              approvedAt: new Date()
            }
          : wf
      ));
      
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error('Erreur approbation:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Rejeter un niveau
  const rejectLevel = useCallback(async (workflowId: string, comments: string) => {
    setLoading(true);
    try {
      setWorkflows(prev => prev.map(wf => 
        wf.id === workflowId 
          ? { 
              ...wf, 
              status: 'REJECTED', 
              comments,
              approvedAt: new Date()
            }
          : wf
      ));
      
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error('Erreur rejet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Vérifier si tous les niveaux sont approuvés
  const isFullyApproved = useCallback((entryId: string) => {
    const entryWorkflows = workflows.filter(wf => wf.entryId === entryId);
    return entryWorkflows.length > 0 && entryWorkflows.every(wf => wf.status === 'APPROVED');
  }, [workflows]);

  // Obtenir le statut actuel d'approbation
  const getApprovalStatus = useCallback((entryId: string) => {
    const entryWorkflows = workflows.filter(wf => wf.entryId === entryId);
    const pending = entryWorkflows.filter(wf => wf.status === 'PENDING');
    const approved = entryWorkflows.filter(wf => wf.status === 'APPROVED');
    const rejected = entryWorkflows.filter(wf => wf.status === 'REJECTED');

    return {
      pending,
      approved,
      rejected,
      totalLevels: entryWorkflows.length,
      completedLevels: approved.length + rejected.length,
      isFullyApproved: approved.length === entryWorkflows.length,
      hasRejection: rejected.length > 0
    };
  }, [workflows]);

  return {
    workflows,
    loading,
    defaultAmountThresholds,
    getRequiredApprovalLevels,
    createApprovalWorkflow,
    approveLevel,
    rejectLevel,
    isFullyApproved,
    getApprovalStatus
  };
};