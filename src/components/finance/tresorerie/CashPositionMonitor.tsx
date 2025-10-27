import React from 'react';
import { CashPosition, BankAccount } from '../../../types';

interface CashPositionMonitorProps {
  cashPositions: CashPosition[];
  bankAccounts: BankAccount[];
}

export const CashPositionMonitor: React.FC<CashPositionMonitorProps> = ({
  cashPositions,
  bankAccounts
}) => {
  const latestPosition = cashPositions[cashPositions.length - 1];
  
  if (!latestPosition) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Position de Trésorerie
        </h3>
        <div className="text-center py-8 text-gray-500">
          Aucune donnée de trésorerie disponible
        </div>
      </div>
    );
  }

  const getStatusColor = (currentBalance: number, minimumBalance: number, targetBalance: number) => {
    if (currentBalance < minimumBalance) return 'red';
    if (currentBalance < targetBalance) return 'yellow';
    return 'green';
  };

  const status = getStatusColor(
    latestPosition.totalCash,
    latestPosition.minimumBalance,
    latestPosition.targetBalance
  );

  const statusConfig = {
    red: { label: 'Critique', color: 'bg-red-100 text-red-800 border-red-200' },
    yellow: { label: 'Attention', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    green: { label: 'Saine', color: 'bg-green-100 text-green-800 border-green-200' }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Position de Trésorerie
        </h3>
        <span className={`px-3 py-1 text-sm font-medium border rounded-full ${statusConfig[status].color}`}>
          {statusConfig[status].label}
        </span>
      </div>

      {/* Indicateurs principaux */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {new Intl.NumberFormat('fr-FR', { 
              style: 'currency', 
              currency: 'XAF' 
            }).format(latestPosition.totalCash)}
          </div>
          <div className="text-sm text-blue-600 font-medium">Trésorerie totale</div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {new Intl.NumberFormat('fr-FR', { 
              style: 'currency', 
              currency: 'XAF' 
            }).format(latestPosition.expectedReceipts)}
          </div>
          <div className="text-sm text-green-600 font-medium">Encaissements attendus</div>
        </div>

        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {new Intl.NumberFormat('fr-FR', { 
              style: 'currency', 
              currency: 'XAF' 
            }).format(latestPosition.upcomingPayments)}
          </div>
          <div className="text-sm text-red-600 font-medium">Décaissements à venir</div>
        </div>

        <div className={`text-center p-4 rounded-lg ${
          latestPosition.netCashFlow >= 0 ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className={`text-2xl font-bold ${
            latestPosition.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {latestPosition.netCashFlow >= 0 ? '+' : ''}
            {new Intl.NumberFormat('fr-FR', { 
              style: 'currency', 
              currency: 'XAF' 
            }).format(latestPosition.netCashFlow)}
          </div>
          <div className={`text-sm font-medium ${
            latestPosition.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            Flux net
          </div>
        </div>
      </div>

      {/* Comptes bancaires */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">Comptes Bancaires</h4>
        <div className="space-y-2">
          {bankAccounts.map(account => (
            <div key={account.id} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <div className="font-medium">{account.name}</div>
                <div className="text-sm text-gray-500">
                  {account.bankName} • {account.accountNumber}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">
                  {new Intl.NumberFormat('fr-FR', { 
                    style: 'currency', 
                    currency: 'XAF' 
                  }).format(account.currentBalance)}
                </div>
                <div className={`text-sm ${
                  account.currentBalance < 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {account.currentBalance < 0 ? 'Découvert' : 'Solde positif'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seuils et alertes */}
      <div className="border-t pt-4">
        <h4 className="text-md font-medium text-gray-900 mb-3">Seuils de Trésorerie</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-700">
              {new Intl.NumberFormat('fr-FR', { 
                style: 'currency', 
                currency: 'XAF' 
              }).format(latestPosition.minimumBalance)}
            </div>
            <div className="text-sm text-gray-600">Minimum requis</div>
          </div>
          
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-semibold text-blue-600">
              {new Intl.NumberFormat('fr-FR', { 
                style: 'currency', 
                currency: 'XAF' 
              }).format(latestPosition.targetBalance)}
            </div>
            <div className="text-sm text-blue-600">Cible</div>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-lg font-semibold text-orange-600">
              {new Intl.NumberFormat('fr-FR', { 
                style: 'currency', 
                currency: 'XAF' 
              }).format(latestPosition.alertThreshold)}
            </div>
            <div className="text-sm text-orange-600">Seuil d'alerte</div>
          </div>
        </div>
      </div>
    </div>
  );
};