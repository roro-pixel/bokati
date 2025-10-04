import { useState, useEffect } from 'react';
import { User } from '../../types';

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Simulation d'appel API
        setTimeout(() => {
          const mockUsers: User[] = [
            {
              id: '1',
              username: 'admin',
              email: 'admin@kerservice.cg',
              role: 'ADMIN',
              entity: '001',
              isActive: true,
              createdAt: new Date('2025-01-01'),
              lastLogin: new Date('2025-08-20'),
              phone: '+242 06 123 456',
              department: 'Direction',
            },
            {
              id: '2',
              username: 'comptable',
              email: 'comptable@kerservice.cg',
              role: 'COMPTABLE',
              entity: '001',
              isActive: true,
              createdAt: new Date('2025-01-01'),
              lastLogin: new Date('2025-08-20'),
              phone: '+242 06 695 04 31',
              department: 'Comptabilité',
            },
          ];
          setUsers(mockUsers);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Erreur lors du chargement des utilisateurs');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const createUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      // Validation des règles métier
      if (users.some(u => u.username === userData.username)) {
        throw new Error('Le nom d\'utilisateur existe déjà');
      }

      if (users.some(u => u.email === userData.email)) {
        throw new Error('L\'adresse email existe déjà');
      }

      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };

      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de l\'utilisateur');
      throw err;
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === id ? { ...user, ...userData } : user
      ));
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'utilisateur');
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression de l\'utilisateur');
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
  };
};