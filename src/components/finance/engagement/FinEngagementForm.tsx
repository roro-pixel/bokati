import React, { useState } from 'react';
import { Engagement, EngagementItem, Budget } from '../../../types';

interface FinEngagementFormProps {
  budgets: Budget[];
  onSubmit: (engagement: Omit<Engagement, 'id' | 'engagementNumber' | 'createdAt' | 'createdBy'>) => void;
  onCancel?: () => void;
  initialData?: Partial<Engagement>;
}

export const FinEngagementForm: React.FC<FinEngagementFormProps> = ({
  budgets,
  onSubmit,
  onCancel,
  initialData
}) => {
  const [formData, setFormData] = useState({
    type: initialData?.type || 'PURCHASE_ORDER',
    supplierName: initialData?.supplierName || '',
    budgetId: initialData?.budgetId || '',
    engagementDate: initialData?.engagementDate ? 
      new Date(initialData.engagementDate).toISOString().split('T')[0] : 
      new Date().toISOString().split('T')[0],
    dueDate: initialData?.dueDate ? 
      new Date(initialData.dueDate).toISOString().split('T')[0] : 
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: initialData?.description || '',
    reference: initialData?.reference || '',
    items: initialData?.items || [] as EngagementItem[]
  });

  const [newItem, setNewItem] = useState({
    productName: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    budgetAccountId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const engagementData = {
      ...formData,
      engagementDate: new Date(formData.engagementDate),
      dueDate: new Date(formData.dueDate),
      totalAmount: formData.items.reduce((sum, item) => sum + item.totalAmount, 0),
      committedAmount: formData.items.reduce((sum, item) => sum + item.totalAmount, 0),
      paidAmount: 0,
      dueAmount: formData.items.reduce((sum, item) => sum + item.totalAmount, 0),
      status: 'DRAFT' as const,
      entity: 'current-entity',
      items: formData.items
    };

    onSubmit(engagementData);
  };

  const addItem = () => {
    if (newItem.productName && newItem.unitPrice > 0) {
      const item: EngagementItem = {
        id: `item_${Date.now()}`,
        engagementId: 'temp',
        productName: newItem.productName,
        description: newItem.description,
        quantity: newItem.quantity,
        unitPrice: newItem.unitPrice,
        totalAmount: newItem.quantity * newItem.unitPrice,
        budgetAccountId: newItem.budgetAccountId
      };

      setFormData(prev => ({
        ...prev,
        items: [...prev.items, item]
      }));

      setNewItem({
        productName: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        budgetAccountId: ''
      });
    }
  };

  const removeItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const selectedBudget = budgets.find(b => b.id === formData.budgetId);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        {initialData ? 'Modifier l\'engagement' : 'Nouvel engagement'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations générales */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type d'engagement *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="PURCHASE_ORDER">Bon de commande</option>
              <option value="CONTRACT">Contrat</option>
              <option value="SERVICE_AGREEMENT">Convention de service</option>
              <option value="LEASE">Bail</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fournisseur *
            </label>
            <input
              type="text"
              value={formData.supplierName}
              onChange={(e) => setFormData(prev => ({ ...prev, supplierName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget *
            </label>
            <select
              value={formData.budgetId}
              onChange={(e) => setFormData(prev => ({ ...prev, budgetId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un budget</option>
              {budgets.map(budget => (
                <option key={budget.id} value={budget.id}>
                  {budget.name} - {new Intl.NumberFormat('fr-FR', { 
                    style: 'currency', 
                    currency: 'XAF' 
                  }).format(budget.remainingAmount)} restant
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Référence
            </label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="N° de commande, contrat..."
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date d'engagement *
            </label>
            <input
              type="date"
              value={formData.engagementDate}
              onChange={(e) => setFormData(prev => ({ ...prev, engagementDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date d'échéance *
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Ajout d'articles */}
        <div className="border-t pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Articles</h4>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-5 gap-3 mb-3">
              <input
                type="text"
                placeholder="Article"
                value={newItem.productName}
                onChange={(e) => setNewItem(prev => ({ ...prev, productName: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Description"
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Quantité"
                value={newItem.quantity}
                onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                min="1"
              />
              <input
                type="number"
                placeholder="Prix unitaire"
                value={newItem.unitPrice}
                onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                step="0.01"
                min="0"
              />
              <button
                type="button"
                onClick={addItem}
                disabled={!newItem.productName || newItem.unitPrice <= 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Ajouter
              </button>
            </div>
          </div>

          {/* Liste des articles */}
          {formData.items.length > 0 ? (
            <div className="space-y-2">
              {formData.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {item.quantity} × {new Intl.NumberFormat('fr-FR', { 
                        style: 'currency', 
                        currency: 'XAF' 
                      }).format(item.unitPrice)}
                    </div>
                    <div className="text-lg font-semibold text-green-600">
                      {new Intl.NumberFormat('fr-FR', { 
                        style: 'currency', 
                        currency: 'XAF' 
                      }).format(item.totalAmount)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="ml-4 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 border-2 border-dashed rounded-lg">
              Aucun article ajouté
            </div>
          )}
        </div>

        {/* Total */}
        {formData.items.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total engagement:</span>
              <span className="text-green-600">
                {new Intl.NumberFormat('fr-FR', { 
                  style: 'currency', 
                  currency: 'XAF' 
                }).format(formData.items.reduce((sum, item) => sum + item.totalAmount, 0))}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={formData.items.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {initialData ? 'Modifier' : 'Créer'} l'engagement
          </button>
        </div>
      </form>
    </div>
  );
};