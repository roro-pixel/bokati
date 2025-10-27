import React, { useState } from 'react';
import { Budget, BudgetLine } from '../../../types';

interface FinCategorySelectorProps {
  budgets: Budget[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  multiSelect?: boolean;
}

export const FinCategorySelector: React.FC<FinCategorySelectorProps> = ({
  budgets,
  selectedCategories,
  onCategoriesChange,
  multiSelect = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Extraire toutes les catégories uniques des lignes budgétaires
  const allCategories = Array.from(
    new Set(
      budgets.flatMap(budget => 
        budget.lines.map(line => line.accountName)
      )
    )
  ).filter(category => 
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryToggle = (category: string) => {
    if (multiSelect) {
      const newSelection = selectedCategories.includes(category)
        ? selectedCategories.filter(c => c !== category)
        : [...selectedCategories, category];
      onCategoriesChange(newSelection);
    } else {
      onCategoriesChange([category]);
    }
  };

  const getCategoryStats = (category: string) => {
    const categoryLines = budgets.flatMap(budget =>
      budget.lines.filter(line => line.accountName === category)
    );
    
    const totalBudget = categoryLines.reduce((sum, line) => sum + line.totalAmount, 0);
    const totalSpent = categoryLines.reduce((sum, line) => sum + line.totalActual, 0);
    const utilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return { totalBudget, totalSpent, utilization };
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Sélection des Catégories
        </h3>
        
        {/* Barre de recherche */}
        <input
          type="text"
          placeholder="Rechercher une catégorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Liste des catégories */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {allCategories.map((category) => {
          const stats = getCategoryStats(category);
          const isSelected = selectedCategories.includes(category);

          return (
            <div
              key={category}
              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleCategoryToggle(category)}
            >
              <div className="flex items-center space-x-3">
                <input
                  type={multiSelect ? "checkbox" : "radio"}
                  checked={isSelected}
                  onChange={() => {}}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div>
                  <div className="font-medium text-gray-900">{category}</div>
                  <div className="text-sm text-gray-500">
                    Budget: {new Intl.NumberFormat('fr-FR', { 
                      style: 'currency', 
                      currency: 'XAF' 
                    }).format(stats.totalBudget)}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={`text-sm font-medium ${
                  stats.utilization > 90 ? 'text-red-600' :
                  stats.utilization > 75 ? 'text-orange-600' :
                  'text-green-600'
                }`}>
                  {stats.utilization.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">Utilisation</div>
              </div>
            </div>
          );
        })}

        {allCategories.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            Aucune catégorie trouvée
          </div>
        )}
      </div>

      {/* Actions */}
      {selectedCategories.length > 0 && (
        <div className="flex justify-between items-center pt-4 mt-4 border-t">
          <span className="text-sm text-gray-600">
            {selectedCategories.length} catégorie(s) sélectionnée(s)
          </span>
          <button
            onClick={() => onCategoriesChange([])}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded hover:bg-red-50 transition-colors"
          >
            Tout désélectionner
          </button>
        </div>
      )}
    </div>
  );
};