import React, { useState } from 'react';
import { BankAccount } from '../../../types';

interface FinAccountSelectorProps {
  accounts: BankAccount[];
  selectedAccounts: string[];
  onAccountsChange: (accountIds: string[]) => void;
  multiSelect?: boolean;
  showBalance?: boolean;
}

export const FinAccountSelector: React.FC<FinAccountSelectorProps> = ({
  accounts,
  selectedAccounts,
  onAccountsChange,
  multiSelect = true,
  showBalance = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAccounts = accounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.accountNumber.includes(searchTerm) ||
    account.bankName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAccountToggle = (accountId: string) => {
    if (multiSelect) {
      const newSelection = selectedAccounts.includes(accountId)
        ? selectedAccounts.filter(id => id !== accountId)
        : [...selectedAccounts, accountId];
      onAccountsChange(newSelection);
    } else {
      onAccountsChange([accountId]);
    }
  };

  const getAccountTypeColor = (type: string) => {
    const colors = {
      CHECKING: 'bg-blue-100 text-blue-800',
      SAVINGS: 'bg-green-100 text-green-800',
      PAYROLL: 'bg-purple-100 text-purple-800',
      TAX: 'bg-orange-100 text-orange-800',
      INVESTMENT: 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getAccountTypeLabel = (type: string) => {
    const labels = {
      CHECKING: 'Compte courant',
      SAVINGS: 'Épargne',
      PAYROLL: 'Paie',
      TAX: 'Fiscal',
      INVESTMENT: 'Investissement'
    };
    return labels[type] || type;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Sélection de Comptes
        </h3>
        
        {/* Barre de recherche */}
        <input
          type="text"
          placeholder="Rechercher un compte, numéro ou banque..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Liste des comptes */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredAccounts.map((account) => {
          const isSelected = selectedAccounts.includes(account.id);
          const isOverdrawn = account.currentBalance < 0;

          return (
            <div
              key={account.id}
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              } ${isOverdrawn ? 'border-l-4 border-l-red-500' : ''}`}
              onClick={() => handleAccountToggle(account.id)}
            >
              <div className="flex items-center space-x-4 flex-1">
                <input
                  type={multiSelect ? "checkbox" : "radio"}
                  checked={isSelected}
                  onChange={() => {}}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="font-medium text-gray-900 truncate">
                      {account.name}
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAccountTypeColor(account.accountType)}`}>
                      {getAccountTypeLabel(account.accountType)}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-500 space-y-1">
                    <div>{account.bankName} • {account.accountNumber}</div>
                    {account.contactInfo?.accountManager && (
                      <div>Gestionnaire: {account.contactInfo.accountManager}</div>
                    )}
                  </div>
                </div>
              </div>

              {showBalance && (
                <div className="text-right ml-4">
                  <div className={`text-lg font-semibold ${
                    isOverdrawn ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {new Intl.NumberFormat('fr-FR', { 
                      style: 'currency', 
                      currency: 'XAF' 
                    }).format(account.currentBalance)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Limite: {new Intl.NumberFormat('fr-FR', { 
                      style: 'currency', 
                      currency: 'XAF' 
                    }).format(account.overdraftLimit)}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredAccounts.length === 0 && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
            {searchTerm ? 'Aucun compte trouvé' : 'Aucun compte disponible'}
          </div>
        )}
      </div>

      {/* Résumé de sélection */}
      {selectedAccounts.length > 0 && (
        <div className="flex justify-between items-center pt-4 mt-4 border-t">
          <div className="text-sm text-gray-600">
            {selectedAccounts.length} compte(s) sélectionné(s) • 
            Total: {new Intl.NumberFormat('fr-FR', { 
              style: 'currency', 
              currency: 'XAF' 
            }).format(
              accounts
                .filter(acc => selectedAccounts.includes(acc.id))
                .reduce((sum, acc) => sum + acc.currentBalance, 0)
            )}
          </div>
          <button
            onClick={() => onAccountsChange([])}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded hover:bg-red-50 transition-colors"
          >
            Tout désélectionner
          </button>
        </div>
      )}
    </div>
  );
};