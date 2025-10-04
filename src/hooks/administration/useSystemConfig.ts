import { useState, useEffect } from 'react';
import { NumberSequence, SystemParameter } from '../../types';

export const useSystemConfig = () => {
  const [numberSequences, setNumberSequences] = useState<NumberSequence[]>([]);
  const [systemParameters, setSystemParameters] = useState<SystemParameter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        // Simulation d'appel API
        setTimeout(() => {
          const mockSequences: NumberSequence[] = [
            {
              id: '1',
              name: 'Numéros de pièce comptable',
              prefix: 'JOURNAL-',
              suffix: '',
              nextValue: 1001,
              increment: 1,
              padding: 6,
              resetFrequency: 'yearly',
              entity: '001',
              lastResetDate: new Date('2024-01-01'),
            },
            {
              id: '2',
              name: 'Codes client',
              prefix: 'CLI-',
              suffix: '',
              nextValue: 5001,
              increment: 1,
              padding: 5,
              resetFrequency: 'never',
              entity: '001',
            },
          ];

          const mockParameters: SystemParameter[] = [
            {
              id: '1',
              key: 'DEFAULT_FISCAL_YEAR_START',
              value: '1',
              description: 'Mois de début de l\'exercice fiscal (1-12)',
              dataType: 'number',
              entity: '001',
            },
            {
              id: '2',
              key: 'REQUIRE_ENTRY_APPROVAL',
              value: 'true',
              description: 'Exiger l\'approbation des écritures',
              dataType: 'boolean',
              entity: '001',
            },
          ];

          setNumberSequences(mockSequences);
          setSystemParameters(mockParameters);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Erreur lors du chargement de la configuration');
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const createNumberSequence = async (sequence: Omit<NumberSequence, 'id'>) => {
    const newSequence: NumberSequence = {
      ...sequence,
      id: Date.now().toString(),
    };
    setNumberSequences(prev => [...prev, newSequence]);
    return newSequence;
  };

  const updateSystemParameter = async (id: string, value: string) => {
    setSystemParameters(prev =>
      prev.map(param => (param.id === id ? { ...param, value } : param))
    );
  };

  return {
    numberSequences,
    systemParameters,
    loading,
    createNumberSequence,
    updateSystemParameter,
  };
};