import React from 'react';
import { EngagementType, BudgetType } from '../../../types';

interface FinTypeBadgeProps {
  type: EngagementType | BudgetType;
  size?: 'sm' | 'md' | 'lg';
}

export const FinTypeBadge: React.FC<FinTypeBadgeProps> = ({ 
  type, 
  size = 'md' 
}) => {
  const typeConfig = {
    // Types d'engagement
    PURCHASE_ORDER: { label: 'Bon de commande', color: 'blue' },
    CONTRACT: { label: 'Contrat', color: 'purple' },
    SERVICE_AGREEMENT: { label: 'Convention', color: 'green' },
    LEASE: { label: 'Bail', color: 'orange' },
    
    // Types de budget
    OPERATIONAL: { label: 'Opérationnel', color: 'blue' },
    INVESTMENT: { label: 'Investissement', color: 'purple' },
    PROJECT: { label: 'Projet', color: 'green' },
    DEPARTMENTAL: { label: 'Département', color: 'orange' }
  };

  const config = typeConfig[type];
  if (!config) return null;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200'
  };

  return (
    <span className={`
      inline-flex items-center font-medium border rounded-full
      ${sizeClasses[size]}
      ${colorClasses[config.color]}
    `}>
      {config.label}
    </span>
  );
};