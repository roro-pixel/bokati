import React from 'react';
import { Budget, BudgetLine } from '../../../types';

interface FinBudgetChartProps {
  budgets: Budget[];
  selectedBudget?: string;
  onBudgetSelect?: (budgetId: string) => void;
  period?: string;
}

export const FinBudgetChart: React.FC<FinBudgetChartProps> = ({
  budgets,
  selectedBudget,
  onBudgetSelect,
  period = 'total'
}) => {
  const selectedBudgetData = budgets.find(b => b.id === selectedBudget) || budgets[0];

  const getChartData = (budget: Budget) => {
    if (period === 'total') {
      return [
        { name: 'Budget', value: budget.totalAmount, color: '#3b82f6' },
        { name: 'Engagé', value: budget.committedAmount, color: '#f59e0b' },
        { name: 'Dépensé', value: budget.actualSpent, color: '#ef4444' },
        { name: 'Restant', value: budget.remainingAmount, color: '#10b981' }
      ];
    }

    // Pour une période spécifique
    const line = budget.lines[0]; // Simplifié pour l'exemple
    const periodData = line?.amounts.find(a => a.period === period);
    
    return [
      { name: 'Budget', value: periodData?.amount || 0, color: '#3b82f6' },
      { name: 'Engagé', value: periodData?.committed || 0, color: '#f59e0b' },
      { name: 'Dépensé', value: periodData?.actual || 0, color: '#ef4444' }
    ];
  };

  const data = selectedBudgetData ? getChartData(selectedBudgetData) : [];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Analyse Budgétaire
        </h3>
        {selectedBudgetData && (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            selectedBudgetData.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
            selectedBudgetData.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {selectedBudgetData.status}
          </span>
        )}
      </div>

      {selectedBudgetData ? (
        <div className="space-y-4">
          {/* Graphique simple en barres */}
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-900 font-medium">
                    {new Intl.NumberFormat('fr-FR', { 
                      style: 'currency', 
                      currency: 'XAF' 
                    }).format(item.value)}
                  </span>
                  {item.name !== 'Restant' && (
                    <span className="text-xs text-gray-500">
                      {((item.value / selectedBudgetData.totalAmount) * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Indicateurs de performance */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {((selectedBudgetData.actualSpent / selectedBudgetData.totalAmount) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">Taux d'exécution</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                selectedBudgetData.remainingAmount >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {new Intl.NumberFormat('fr-FR', { 
                  style: 'currency', 
                  currency: 'XAF' 
                }).format(selectedBudgetData.remainingAmount)}
              </div>
              <div className="text-xs text-gray-500">Solde</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {((selectedBudgetData.committedAmount / selectedBudgetData.totalAmount) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">Engagé</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Aucun budget sélectionné
        </div>
      )}
    </div>
  );
};