import { useState, useEffect } from 'react';
import { Product, ProductCategory, PriceList, ProductStats, ProductFilter, UseProductsReturn } from '../../types';

// Données mock réalistes
const mockCategories: ProductCategory[] = [
  {
    id: 'cat-001',
    code: 'INFO',
    name: 'Informatique',
    description: 'Produits informatiques et électroniques',
    level: 1,
    isActive: true,
    entity: 'ENT-001',
    createdAt: new Date('2023-01-01'),
    createdBy: 'admin'
  },
  {
    id: 'cat-002', 
    code: 'BUREAU',
    name: 'Fournitures Bureau',
    description: 'Articles de bureau et papeterie',
    level: 1,
    isActive: true,
    entity: 'ENT-001',
    createdAt: new Date('2023-01-01'),
    createdBy: 'admin'
  },
  {
    id: 'cat-003',
    code: 'SERV',
    name: 'Services',
    description: 'Prestations de services',
    level: 1,
    isActive: true,
    entity: 'ENT-001', 
    createdAt: new Date('2023-01-01'),
    createdBy: 'admin'
  }
];

const mockProducts: Product[] = [
  {
    id: 'PROD-2024-001',
    code: 'PROD-2024-001',
    reference: 'LAP-DELL-001',
    type: 'PRODUIT',
    name: 'Ordinateur Portable Dell Latitude 5420',
    description: 'Ordinateur portable professionnel, Intel Core i5, 8GB RAM, 256GB SSD',
    categoryId: 'cat-001',
    brand: 'Dell',
    model: 'Latitude 5420',
    chartAccountId: 'acc_607000',
    taxCode: 'TVA_19.25',
    stockManagement: 'SUIVI',
    currentStock: 15,
    minimumStock: 5,
    maximumStock: 50,
    reservedStock: 3,
    availableStock: 12,
    purchaseUnit: 'UNITE',
    salesUnit: 'UNITE',
    conversionFactor: 1,
    costPrice: 450000,
    standardPrice: 650000,
    pricingMethod: 'FIXE',
    images: [],
    documents: [],
    isActive: true,
    isPurchasable: true,
    isSellable: true,
    entity: 'ENT-001',
    createdAt: new Date('2024-01-15'),
    createdBy: 'admin'
  },
  {
    id: 'PROD-2024-002',
    code: 'PROD-2024-002', 
    reference: 'SERV-MAINT-001',
    type: 'SERVICE',
    name: 'Maintenance Informatique Mensuelle',
    description: 'Forfait de maintenance préventive et corrective',
    categoryId: 'cat-003',
    chartAccountId: 'acc_706000',
    taxCode: 'TVA_19.25',
    stockManagement: 'AUCUN',
    currentStock: 0,
    minimumStock: 0,
    maximumStock: 0,
    reservedStock: 0,
    availableStock: 0,
    purchaseUnit: 'HEURE',
    salesUnit: 'FORFAIT',
    conversionFactor: 1,
    costPrice: 0,
    standardPrice: 150000,
    pricingMethod: 'FIXE',
    images: [],
    documents: [],
    isActive: true,
    isPurchasable: false,
    isSellable: true,
    entity: 'ENT-001',
    createdAt: new Date('2024-01-20'),
    createdBy: 'admin'
  },
  {
    id: 'PROD-2024-003',
    code: 'PROD-2024-003',
    reference: 'PAP-A4-001',
    type: 'PRODUIT',
    name: 'Rame de Papier A4 80g',
    description: 'Rame de 500 feuilles papier A4 80g',
    categoryId: 'cat-002',
    brand: 'Xerox',
    chartAccountId: 'acc_607100',
    taxCode: 'TVA_19.25',
    stockManagement: 'SUIVI',
    currentStock: 45,
    minimumStock: 20,
    maximumStock: 200,
    reservedStock: 0,
    availableStock: 45,
    purchaseUnit: 'RAMETTE',
    salesUnit: 'RAMETTE',
    conversionFactor: 1,
    costPrice: 2500,
    standardPrice: 4500,
    pricingMethod: 'FIXE',
    images: [],
    documents: [],
    isActive: true,
    isPurchasable: true,
    isSellable: true,
    entity: 'ENT-001',
    createdAt: new Date('2024-02-01'),
    createdBy: 'admin'
  }
];

const mockPriceLists: PriceList[] = [
  {
    id: 'price-001',
    name: 'Tarif Standard',
    description: 'Tarif public standard',
    currency: 'XAF',
    isDefault: true,
    validFrom: new Date('2024-01-01'),
    prices: [
      {
        id: 'price-item-001',
        priceListId: 'price-001',
        productId: 'PROD-2024-001',
        unitPrice: 650000,
        minimumQuantity: 1,
        validFrom: new Date('2024-01-01'),
        isActive: true
      }
    ],
    entity: 'ENT-001',
    createdAt: new Date('2024-01-01'),
    createdBy: 'admin'
  }
];

const mockStats: ProductStats = {
  totalProducts: 156,
  activeProducts: 142,
  outOfStock: 8,
  lowStock: 15,
  totalStockValue: 48500000,
  averageCost: 310000,
  topSelling: [
    { product: 'Ordinateur Portable Dell', quantity: 45 },
    { product: 'Rame Papier A4', quantity: 120 },
    { product: 'Cartouche Encre HP', quantity: 89 }
  ],
  categories: [
    { category: 'Informatique', count: 67 },
    { category: 'Fournitures Bureau', count: 54 },
    { category: 'Services', count: 35 }
  ]
};

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState<ProductCategory[]>(mockCategories);
  const [priceLists, setPriceLists] = useState<PriceList[]>(mockPriceLists);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats] = useState<ProductStats>(mockStats);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProducts(mockProducts);
      setCategories(mockCategories);
      setPriceLists(mockPriceLists);
      setLoading(false);
    }, 1000);
  }, []);

  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'createdBy'>) => {
    setLoading(true);
    try {
      const newProduct: Product = {
        ...productData,
        id: `PROD-${Date.now()}`,
        createdAt: new Date(),
        createdBy: 'current-user'
      };
      setProducts(prev => [...prev, newProduct]);
    } catch (err) {
      setError('Erreur lors de la création du produit');
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setLoading(true);
    try {
      setProducts(prev => prev.map(product =>
        product.id === id 
          ? { ...product, ...updates, updatedAt: new Date() }
          : product
      ));
    } catch (err) {
      setError('Erreur lors de la mise à jour du produit');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression du produit');
    } finally {
      setLoading(false);
    }
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const searchProducts = (filters: ProductFilter) => {
    return products.filter(product => {
      if (filters.type && product.type !== filters.type) return false;
      if (filters.categoryId && product.categoryId !== filters.categoryId) return false;
      if (filters.isActive !== undefined && product.isActive !== filters.isActive) return false;
      
      if (filters.stockStatus) {
        const availableStock = product.currentStock - product.reservedStock;
        switch (filters.stockStatus) {
          case 'OUT_OF_STOCK': 
            if (availableStock > 0) return false;
            break;
          case 'LOW_STOCK':
            if (availableStock >= product.minimumStock) return false;
            break;
          case 'IN_STOCK':
            if (availableStock <= 0) return false;
            break;
        }
      }

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.code.toLowerCase().includes(searchLower) ||
          product.reference.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  };

  const updateStock = async (productId: string, quantity: number, reason: string) => {
    setLoading(true);
    try {
      setProducts(prev => prev.map(product =>
        product.id === productId 
          ? { 
              ...product, 
              currentStock: product.currentStock + quantity,
              updatedAt: new Date()
            }
          : product
      ));
    } catch (err) {
      setError('Erreur lors de la mise à jour du stock');
    } finally {
      setLoading(false);
    }
  };

  const exportProducts = (filters: ProductFilter) => {
    const filteredProducts = searchProducts(filters);
    console.log('Exporting products:', filteredProducts);
  };

  return {
    products,
    categories,
    priceLists,
    loading,
    error,
    stats,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    searchProducts,
    updateStock,
    exportProducts
  };
};