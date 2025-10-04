import { useState, useEffect } from 'react';
import { Entity } from '../../types';

const validateRCCM = (rccm: string): boolean => {
  const rccmRegex = /^CG-BZV-\d{2}-\d{4}-[A-Z]-$/;
  return rccmRegex.test(rccm);
};

const validateNIU = (niu: string): boolean => {
  const niuRegex = /^[A-Z0-9]{10,15}$/;
  return niuRegex.test(niu);
};

export const useEntityManagement = () => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        setLoading(true);
        // Simulation d'appel API
        setTimeout(() => {
          const mockEntities: Entity[] = [
            {
              id: '1',
              code: '001',
              name: 'Ker. Service',
              taxId: 'T123456789',
              rccmNumber: 'CG-BZV-01-2025-A',
              niuNumber: 'NIU123456789',
              address: '15 Avenue Poton, Pointe-Noire',
              phone: '+242 05 354 22 11',
              currency: 'XAF',
              country: 'Congo Brazzaville',
              accountingSystem: 'Normal',
              fiscalYearStart: new Date('2025-01-01'),
              isActive: true,
              createdAt: new Date('2025-01-01'),
            },
          ];
          setEntities(mockEntities);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Erreur lors du chargement des entités');
        setLoading(false);
      }
    };

    fetchEntities();
  }, []);

  const createEntity = async (entityData: Omit<Entity, 'id' | 'createdAt'>) => {
    try {
      // Validation des règles métier OHADA
      if (!validateRCCM(entityData.rccmNumber)) {
        throw new Error('Format RCCM invalide. Format attendu: CG-BZV-XX-XXXX-X');
      }

      if (!validateNIU(entityData.niuNumber)) {
        throw new Error('Format NIU invalide');
      }

      if (entityData.currency !== 'XAF') {
        throw new Error('La devise doit être XAF pour les entités congolaises');
      }

      const newEntity: Entity = {
        ...entityData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };

      setEntities(prev => [...prev, newEntity]);
      return newEntity;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de l\'entité');
      throw err;
    }
  };

  const updateEntity = async (id: string, entityData: Partial<Entity>) => {
    try {
      setEntities(prev => prev.map(entity => 
        entity.id === id ? { ...entity, ...entityData } : entity
      ));
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'entité');
      throw err;
    }
  };

  const deleteEntity = async (id: string) => {
    try {
      setEntities(prev => prev.filter(entity => entity.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression de l\'entité');
      throw err;
    }
  };

  return {
    entities,
    loading,
    error,
    createEntity,
    updateEntity,
    deleteEntity,
  };
};