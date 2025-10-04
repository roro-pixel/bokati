import React, { useState } from 'react';
import { RoleMatrix } from '../../../components/administration/RoleMatrix';

// Données mockées pour les rôles et permissions
const mockRoles = [
  {
    id: '1',
    name: 'Administrateur',
    permissions: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  },
  {
    id: '2',
    name: 'Directeur Financier',
    permissions: ['2', '3', '4', '5', '6', '7', '8', '9'],
  },
  {
    id: '3',
    name: 'Comptable',
    permissions: ['3', '4', '5', '6'],
  },
];

const mockPermissions = [
  // Gestion des entités
  { id: '1', category: 'Gestion des entités', action: 'Créer entité', description: 'Créer de nouvelles entités' },
  { id: '2', category: 'Gestion des entités', action: 'Modifier entité', description: 'Modifier les entités existantes' },
  { id: '3', category: 'Gestion des entités', action: 'Supprimer entité', description: 'Supprimer des entités' },
  
  // Gestion des utilisateurs
  { id: '4', category: 'Gestion des utilisateurs', action: 'Créer utilisateur', description: 'Créer de nouveaux utilisateurs' },
  { id: '5', category: 'Gestion des utilisateurs', action: 'Modifier utilisateur', description: 'Modifier les utilisateurs existants' },
  { id: '6', category: 'Gestion des utilisateurs', action: 'Supprimer utilisateur', description: 'Supprimer des utilisateurs' },
  
  // Plan comptable
  { id: '7', category: 'Plan comptable', action: 'Créer compte', description: 'Créer de nouveaux comptes' },
  { id: '8', category: 'Plan comptable', action: 'Modifier compte', description: 'Modifier les comptes existants' },
  { id: '9', category: 'Plan comptable', action: 'Désactiver compte', description: 'Désactiver des comptes' },
  
  // Journal
  { id: '10', category: 'Journal', action: 'Créer écriture', description: 'Créer de nouvelles écritures' },
  { id: '11', category: 'Journal', action: 'Approuver écriture', description: 'Approuver des écritures' },
  { id: '12', category: 'Journal', action: 'Poster écriture', description: 'Poster des écritures' },
];

export const RolePermissions: React.FC = () => {
  const [roles, setRoles] = useState(mockRoles);
  const [permissions] = useState(mockPermissions);

  const handlePermissionToggle = (roleId: string, permissionId: string) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const newPermissions = role.permissions.includes(permissionId)
          ? role.permissions.filter(p => p !== permissionId)
          : [...role.permissions, permissionId];
        
        return { ...role, permissions: newPermissions };
      }
      return role;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Rôles et Permissions</h1>
      </div>

      <RoleMatrix
        roles={roles}
        permissions={permissions}
        onPermissionToggle={handlePermissionToggle}
      />

      {/* <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Rôles standards OHADA</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li><strong>ADMIN:</strong> Accès complet au système</li>
          <li><strong>CFO:</strong> Gestion financière et approbation</li>
          <li><strong>ACCOUNTANT:</strong> Traitement des transactions</li>
          <li><strong>MANAGER:</strong> Reporting et consultation</li>
          <li><strong>AUDITOR:</strong> Accès en lecture seule</li>
        </ul>
      </div> */}
    </div>
  );
};