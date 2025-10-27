import React from 'react';
import { CashFlowForecast as CashFlowForecastType, CashFlowScenario } from '../../../types';

interface CashFlowForecastProps {
  forecasts: CashFlowForecastType[];
  scenarios: CashFlowScenario[];
  onScenarioRun: (scenarioId: string) => void;
}

export const CashFlowForecast: React.FC<CashFlowForecastProps> = ({
  forecasts,
  scenarios,
  onScenarioRun
}) => {
  const latestForecast = forecasts[forecasts.length - 1];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Prévisions de Trésorerie
        </h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
            Nouvelle prévision
          </button>
        </div>
      </div>

      {/* Scénarios */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">Scénarios</h4>
        <div className="grid grid-cols-3 gap-4">
          {scenarios.map(scenario => (
            <div key={scenario.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">{scenario.name}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  scenario.type === 'OPTIMISTIC' ? 'bg-green-100 text-green-800' :
                  scenario.type === 'PESSIMISTIC' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {scenario.type}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
              <button
                onClick={() => onScenarioRun(scenario.id)}
                className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
              >
                Exécuter
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dernière prévision */}
      {latestForecast && (
        <div className="border rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            Dernière prévision ({latestForecast.periodType})
          </h4>
          
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('fr-FR', { 
                  style: 'currency', 
                  currency: 'XAF' 
                }).format(latestForecast.cashPosition.beginningBalance)}
              </div>
              <div className="text-xs text-blue-600">Solde initial</div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat('fr-FR', { 
                  style: 'currency', 
                  currency: 'XAF' 
                }).format(latestForecast.cashPosition.expectedReceipts)}
              </div>
              <div className="text-xs text-green-600">Entrées attendues</div>
            </div>
            
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {new Intl.NumberFormat('fr-FR', { 
                  style: 'currency', 
                  currency: 'XAF' 
                }).format(latestForecast.cashPosition.expectedPayments)}
              </div>
              <div className="text-xs text-red-600">Sorties attendues</div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {new Intl.NumberFormat('fr-FR', { 
                  style: 'currency', 
                  currency: 'XAF' 
                }).format(latestForecast.cashPosition.endingBalance)}
              </div>
              <div className="text-xs text-purple-600">Solde final</div>
            </div>
          </div>

          {/* Détails des flux */}
          <div className="space-y-2">
            <h5 className="font-medium text-gray-700">Détails des flux</h5>
            {latestForecast.details.map((detail, index) => (
              <div key={index} className="flex justify-between items-center p-2 border-b">
                <div>
                  <div className="font-medium">{detail.description}</div>
                  <div className="text-sm text-gray-500">{detail.category}</div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${
                    detail.type === 'RECEIPT' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {detail.type === 'RECEIPT' ? '+' : '-'}{' '}
                    {new Intl.NumberFormat('fr-FR', { 
                      style: 'currency', 
                      currency: 'XAF' 
                    }).format(detail.amount)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Probabilité: {detail.probability}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};