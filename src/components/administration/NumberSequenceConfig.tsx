import React, { useState } from 'react';
import { NumberSequence } from '../../types';

interface NumberSequenceConfigProps {
  sequence?: NumberSequence;
  onSubmit: (sequence: Omit<NumberSequence, 'id'>) => Promise<void>;
  onCancel: () => void;
  entities: { id: string; name: string }[];
}

export const NumberSequenceConfig: React.FC<NumberSequenceConfigProps> = ({
  sequence,
  onSubmit,
  onCancel,
  entities,
}) => {
  const [formData, setFormData] = useState({
    name: sequence?.name || '',
    prefix: sequence?.prefix || '',
    suffix: sequence?.suffix || '',
    nextValue: sequence?.nextValue || 1,
    increment: sequence?.increment || 1,
    padding: sequence?.padding || 6,
    resetFrequency: sequence?.resetFrequency || 'never',
    entity: sequence?.entity || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'nextValue' || name === 'increment' || name === 'padding' 
        ? parseInt(value) || 0 
        : value 
    }));
  };

  const resetFrequencies = [
    { value: 'never', label: 'Jamais' },
    { value: 'yearly', label: 'Annuellement' },
    { value: 'monthly', label: 'Mensuellement' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {sequence ? 'Modifier la séquence' : 'Créer une nouvelle séquence'}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Nom *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Préfixe</label>
          <input
            type="text"
            name="prefix"
            value={formData.prefix}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Suffixe</label>
          <input
            type="text"
            name="suffix"
            value={formData.suffix}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Prochaine valeur *</label>
          <input
            type="number"
            name="nextValue"
            value={formData.nextValue}
            onChange={handleChange}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Incrément *</label>
          <input
            type="number"
            name="increment"
            value={formData.increment}
            onChange={handleChange}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Padding *</label>
          <input
            type="number"
            name="padding"
            value={formData.padding}
            onChange={handleChange}
            min="1"
            max="10"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Fréquence de réinitialisation</label>
          <select
            name="resetFrequency"
            value={formData.resetFrequency}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {resetFrequencies.map(freq => (
              <option key={freq.value} value={freq.value}>
                {freq.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Entité *</label>
          <select
            name="entity"
            value={formData.entity}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionner une entité</option>
            {entities.map(entity => (
              <option key={entity.id} value={entity.id}>
                {entity.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Format d'exemple:</h3>
        <p className="text-sm text-gray-600">
          {formData.prefix}
          {formData.nextValue.toString().padStart(formData.padding, '0')}
          {formData.suffix}
        </p>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Enregistrement...' : (sequence ? 'Modifier' : 'Créer')}
        </button>
      </div>
    </form>
  );
};