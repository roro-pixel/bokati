import React, { useState } from 'react';
import { BankTransaction, BankAccount } from '../../../types';

interface FinTransactionFlowProps {
  transactions: BankTransaction[];
  accounts: BankAccount[];
  onTransactionMatch?: (transactionId: string, matchId: string) => void;
}

export const FinTransactionFlow: React.FC<FinTransactionFlowProps> = ({
  transactions,
  accounts,
  onTransactionMatch
}) => {
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const filteredTransactions = transactions
    .filter(transaction => 
      (!selectedAccount || transaction.bankAccountId === selectedAccount) &&
      new Date(transaction.transactionDate) >= new Date(dateRange.start) &&
      new Date(transaction.transactionDate) <= new Date(dateRange.end)
    )
    .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());

  const getAccountName = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? `${account.name} (${account.accountNumber})` : 'Compte inconnu';
  };

  const getTransactionType = (amount: number) => {
    return amount >= 0 ? 'CREDIT' : 'DEBIT';
  };

  const formatTransactionDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Flux des Transactions
        </h3>
        
        <div className="flex space-x-3">
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">Tous les comptes</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-900">
            {filteredTransactions.length}
          </div>
          <div className="text-sm text-gray-600">Transactions</div>
        </div>
        
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-semibold text-green-600">
            {new Intl.NumberFormat('fr-FR', { 
              style: 'currency', 
              currency: 'XAF' 
            }).format(
              filteredTransactions
                .filter(t => t.amount > 0)
                .reduce((sum, t) => sum + t.amount, 0)
            )}
          </div>
          <div className="text-sm text-green-600">Total crédits</div>
        </div>
        
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-lg font-semibold text-red-600">
            {new Intl.NumberFormat('fr-FR', { 
              style: 'currency', 
              currency: 'XAF' 
            }).format(
              Math.abs(
                filteredTransactions
                  .filter(t => t.amount < 0)
                  .reduce((sum, t) => sum + t.amount, 0)
              )
            )}
          </div>
          <div className="text-sm text-red-600">Total débits</div>
        </div>
        
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-semibold text-blue-600">
            {filteredTransactions.filter(t => t.isReconciled).length}
          </div>
          <div className="text-sm text-blue-600">Reconciliées</div>
        </div>
      </div>

      {/* Liste des transactions */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className={`flex items-center justify-between p-4 border rounded-lg ${
              transaction.isReconciled 
                ? 'bg-green-50 border-green-200' 
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className={`w-3 h-3 rounded-full ${
                getTransactionType(transaction.amount) === 'CREDIT' 
                  ? 'bg-green-500' 
                  : 'bg-red-500'
              }`} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="font-medium text-gray-900">
                    {transaction.description}
                  </div>
                  {transaction.isReconciled && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Reconciliée
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-gray-500 space-y-1">
                  <div>Réf: {transaction.reference}</div>
                  <div>
                    {getAccountName(transaction.bankAccountId)} • 
                    {formatTransactionDate(transaction.transactionDate)}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right ml-4">
              <div className={`text-lg font-semibold ${
                getTransactionType(transaction.amount) === 'CREDIT' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {getTransactionType(transaction.amount) === 'CREDIT' ? '+' : ''}
                {new Intl.NumberFormat('fr-FR', { 
                  style: 'currency', 
                  currency: 'XAF' 
                }).format(transaction.amount)}
              </div>
              
              <div className="text-sm text-gray-500">
                Solde: {new Intl.NumberFormat('fr-FR', { 
                  style: 'currency', 
                  currency: 'XAF' 
                }).format(transaction.balance)}
              </div>
            </div>
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
            Aucune transaction trouvée pour les critères sélectionnés
          </div>
        )}
      </div>
    </div>
  );
};