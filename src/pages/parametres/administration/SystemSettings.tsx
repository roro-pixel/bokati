import React, { useState } from 'react';
import { NumberSequenceConfig } from '../../../components/administration/NumberSequenceConfig';
import { useSystemConfig } from '../../../hooks/administration/useSystemConfig';
import { useEntityManagement } from '../../../hooks/administration/useEntityManagement';

export const SystemSettings: React.FC = () => {
  const { numberSequences, systemParameters, loading, createNumberSequence, updateSystemParameter } = useSystemConfig();
  const { entities } = useEntityManagement();
  const [showSequenceForm, setShowSequenceForm] = useState(false);
  const [editingSequence, setEditingSequence] = useState<any>(null);

  const handleCreateSequence = async (sequenceData: any) => {
    await createNumberSequence(sequenceData);
    setShowSequenceForm(false);
  };

  const handleParameterChange = async (id: string, value: string) => {
    await updateSystemParameter(id, value);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Configuration des séquences numériques */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Séquences Numériques</h2>
          {!showSequenceForm && (
            <button
              onClick={() => setShowSequenceForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Nouvelle Séquence
            </button>
          )}
        </div>

        {showSequenceForm ? (
          <NumberSequenceConfig
            sequence={editingSequence || undefined}
            onSubmit={handleCreateSequence}
            onCancel={() => {
              setShowSequenceForm(false);
              setEditingSequence(null);
            }}
            entities={entities.map(e => ({ id: e.id, name: e.name }))}
          />
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Format
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prochaine valeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Réinitialisation
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {numberSequences.map((sequence) => (
                  <tr key={sequence.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sequence.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sequence.prefix}
                      {sequence.nextValue.toString().padStart(sequence.padding, '0')}
                      {sequence.suffix}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sequence.nextValue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sequence.resetFrequency === 'never' && 'Jamais'}
                      {sequence.resetFrequency === 'yearly' && 'Annuellement'}
                      {sequence.resetFrequency === 'monthly' && 'Mensuellement'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paramètres système */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Paramètres Système</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paramètre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valeur
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {systemParameters.map((param) => (
                <tr key={param.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {param.key}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {param.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {param.dataType === 'boolean' ? (
                      <select
                        value={param.value}
                        onChange={(e) => handleParameterChange(param.id, e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="true">Oui</option>
                        <option value="false">Non</option>
                      </select>
                    ) : (
                      <input
                        type={param.dataType === 'number' ? 'number' : 'text'}
                        value={param.value}
                        onChange={(e) => handleParameterChange(param.id, e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};