import React, { useState } from 'react';
import { Entity } from '../../types';

interface EntityFormProps {
  entity?: Entity;
  onSubmit: (entityData: Omit<Entity, 'id' | 'createdAt'>) => Promise<void>;
  onCancel: () => void;
}

export const EntityForm: React.FC<EntityFormProps> = ({ entity, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    code: entity?.code || '',
    name: entity?.name || '',
    taxId: entity?.taxId || '',
    rccmNumber: entity?.rccmNumber || '',
    niuNumber: entity?.niuNumber || '',
    address: entity?.address || '',
    phone: entity?.phone || '',
    currency: entity?.currency || 'XAF',
    country: entity?.country || 'Congo Brazzaville',
    accountingSystem: entity?.accountingSystem || 'Normal',
    fiscalYearStart: entity?.fiscalYearStart.toISOString().split('T')[0] || '2025-01-01',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateRCCM = (rccm: string): boolean => {
    const rccmRegex = /^CG-BZV-\d{2}-\d{4}-[A-Z]-$/;
    return rccmRegex.test(rccm);
  };

  const validateNIU = (niu: string): boolean => {
    const niuRegex = /^[A-Z0-9]{10,15}$/;
    return niuRegex.test(niu);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) newErrors.code = 'Le code est requis';
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.taxId.trim()) newErrors.taxId = 'L\'identifiant fiscal est requis';
    
    if (!validateRCCM(formData.rccmNumber)) {
      newErrors.rccmNumber = 'Format RCCM invalide. Format attendu: CG-BZV-XX-XXXX-X';
    }
    
    if (!validateNIU(formData.niuNumber)) {
      newErrors.niuNumber = 'Format NIU invalide';
    }
    
    if (formData.currency !== 'XAF') {
      newErrors.currency = 'La devise doit être XAF pour les entités congolaises';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        fiscalYearStart: new Date(formData.fiscalYearStart),
        isActive: true,
      });
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {entity ? 'Modifier l\'entité' : 'Créer une nouvelle entité'}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Code entité *</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.code ? 'border-red-500' : ''
            }`}
          />
          {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nom *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : ''
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Identifiant fiscal *</label>
        <input
          type="text"
          name="taxId"
          value={formData.taxId}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.taxId ? 'border-red-500' : ''
          }`}
        />
        {errors.taxId && <p className="text-red-500 text-sm">{errors.taxId}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Numéro RCCM *</label>
          <input
            type="text"
            name="rccmNumber"
            value={formData.rccmNumber}
            onChange={handleChange}
            placeholder="CG-BZV-01-2025-A"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.rccmNumber ? 'border-red-500' : ''
            }`}
          />
          {errors.rccmNumber && <p className="text-red-500 text-sm">{errors.rccmNumber}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Numéro NIU *</label>
          <input
            type="text"
            name="niuNumber"
            value={formData.niuNumber}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.niuNumber ? 'border-red-500' : ''
            }`}
          />
          {errors.niuNumber && <p className="text-red-500 text-sm">{errors.niuNumber}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Adresse</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Téléphone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Devise *</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              errors.currency ? 'border-red-500' : ''
            }`}
          >
            <option value="XAF">XAF (Franc CFA)</option>
          </select>
          {errors.currency && <p className="text-red-500 text-sm">{errors.currency}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Pays</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Système comptable</label>
          <select
            name="accountingSystem"
            value={formData.accountingSystem}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Normal">Normal</option>
            <option value="SMT">Système Minimal Trésor (SMT)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Début d'exercice fiscal</label>
        <input
          type="date"
          name="fiscalYearStart"
          value={formData.fiscalYearStart}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
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
          {isSubmitting ? 'Enregistrement...' : (entity ? 'Modifier' : 'Créer')}
        </button>
      </div>
    </form>
  );
};