import { useState, useEffect } from 'react';
import { SaleQuote, SaleOrder, SalesStats, SalesFilter, UseSalesReturn, SaleItem } from '../../types';

// Données mock réalistes
const mockQuotes: SaleQuote[] = [
  {
    id: 'quote-001',
    quoteNumber: 'DEV-2024-001',
    customerId: 'CL-2024-001',
    customerName: 'SOGEA SATOM CAMEROUN',
    quoteDate: new Date('2024-01-15'),
    validUntil: new Date('2024-02-15'),
    status: 'ACCEPTE',
    items: [
      {
        id: 'item-001',
        productId: 'PROD-2024-001',
        productCode: 'PROD-2024-001',
        productName: 'Ordinateur Portable Dell Latitude 5420',
        quantity: 5,
        unitPrice: 650000,
        discountRate: 5,
        taxRate: 19.25,
        discountAmount: 162500,
        taxAmount: 105218,
        lineTotal: 3250000
      }
    ],
    subtotal: 3250000,
    taxAmount: 625625,
    totalAmount: 3875625,
    paymentTerms: '30 jours',
    deliveryTerms: 'Livraison sous 7 jours',
    notes: 'Configuration standard avec garantie étendue',
    acceptedAt: new Date('2024-01-18'),
    entity: 'ENT-001',
    createdAt: new Date('2024-01-15'),
    createdBy: 'admin'
  }
];

const mockOrders: SaleOrder[] = [
  {
    id: 'order-001',
    orderNumber: 'CMD-2024-001',
    quoteId: 'quote-001',
    customerId: 'CL-2024-001',
    customerName: 'SOGEA SATOM CAMEROUN',
    orderDate: new Date('2024-01-20'),
    status: 'CONFIRME',
    items: [
      {
        id: 'item-001',
        productId: 'PROD-2024-001',
        productCode: 'PROD-2024-001',
        productName: 'Ordinateur Portable Dell Latitude 5420',
        quantity: 5,
        unitPrice: 650000,
        discountRate: 5,
        taxRate: 19.25,
        discountAmount: 162500,
        taxAmount: 105218,
        lineTotal: 3250000
      }
    ],
    deliveryAddress: 'Rue 1.244, Bonanjo Douala',
    deliveryStatus: 'EN_PREPARATION',
    subtotal: 3250000,
    discountAmount: 162500,
    taxAmount: 625625,
    totalAmount: 3713125,
    paymentMethod: 'VIREMENT',
    paidAmount: 0,
    dueAmount: 3713125,
    confirmedAt: new Date('2024-01-20'),
    entity: 'ENT-001',
    createdAt: new Date('2024-01-20'),
    createdBy: 'admin'
  }
];

const mockStats: SalesStats = {
  totalQuotes: 45,
  quotesThisMonth: 12,
  quoteConversionRate: 65,
  totalOrders: 29,
  ordersThisMonth: 8,
  totalRevenue: 185000000,
  revenueThisMonth: 42000000,
  averageOrderValue: 6379310,
  pendingOrders: 5,
  topCustomers: [
    { customer: 'SOGEA SATOM CAMEROUN', amount: 45000000 },
    { customer: 'MTN CAMEROUN', amount: 38000000 },
    { customer: 'ORANGE CAMEROUN', amount: 32000000 }
  ],
  topProducts: [
    { product: 'Ordinateur Portable Dell', quantity: 45 },
    { product: 'Maintenance Informatique', quantity: 32 },
    { product: 'Rame Papier A4', quantity: 120 }
  ]
};

export const useSales = (): UseSalesReturn => {
  const [quotes, setQuotes] = useState<SaleQuote[]>(mockQuotes);
  const [orders, setOrders] = useState<SaleOrder[]>(mockOrders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats] = useState<SalesStats>(mockStats);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setQuotes(mockQuotes);
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const createQuote = async (quoteData: Omit<SaleQuote, 'id' | 'quoteNumber' | 'createdAt' | 'createdBy'>) => {
    setLoading(true);
    try {
      const newQuote: SaleQuote = {
        ...quoteData,
        id: `quote-${Date.now()}`,
        quoteNumber: `DEV-2024-${String(quotes.length + 1).padStart(3, '0')}`,
        createdAt: new Date(),
        createdBy: 'current-user'
      };
      setQuotes(prev => [...prev, newQuote]);
    } catch (err) {
      setError('Erreur lors de la création du devis');
    } finally {
      setLoading(false);
    }
  };

  const updateQuote = async (id: string, updates: Partial<SaleQuote>) => {
    setLoading(true);
    try {
      setQuotes(prev => prev.map(quote =>
        quote.id === id ? { ...quote, ...updates } : quote
      ));
    } catch (err) {
      setError('Erreur lors de la mise à jour du devis');
    } finally {
      setLoading(false);
    }
  };

  const convertQuoteToOrder = async (quoteId: string) => {
    setLoading(true);
    try {
      const quote = quotes.find(q => q.id === quoteId);
      if (quote) {
        const newOrder: SaleOrder = {
          id: `order-${Date.now()}`,
          orderNumber: `CMD-2024-${String(orders.length + 1).padStart(3, '0')}`,
          quoteId: quote.id,
          customerId: quote.customerId,
          customerName: quote.customerName,
          orderDate: new Date(),
          status: 'EN_ATTENTE',
          items: quote.items,
          deliveryAddress: '',
          deliveryStatus: 'EN_PREPARATION',
          subtotal: quote.subtotal,
          discountAmount: 0,
          taxAmount: quote.taxAmount,
          totalAmount: quote.totalAmount,
          paymentMethod: 'VIREMENT',
          paidAmount: 0,
          dueAmount: quote.totalAmount,
          entity: quote.entity,
          createdAt: new Date(),
          createdBy: 'current-user'
        };
        setOrders(prev => [...prev, newOrder]);
        // Marquer le devis comme accepté
        updateQuote(quoteId, { status: 'ACCEPTE', acceptedAt: new Date() });
      }
    } catch (err) {
      setError('Erreur lors de la conversion du devis');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: Omit<SaleOrder, 'id' | 'orderNumber' | 'createdAt' | 'createdBy'>) => {
    setLoading(true);
    try {
      const newOrder: SaleOrder = {
        ...orderData,
        id: `order-${Date.now()}`,
        orderNumber: `CMD-2024-${String(orders.length + 1).padStart(3, '0')}`,
        createdAt: new Date(),
        createdBy: 'current-user'
      };
      setOrders(prev => [...prev, newOrder]);
    } catch (err) {
      setError('Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (id: string, updates: Partial<SaleOrder>) => {
    setLoading(true);
    try {
      setOrders(prev => prev.map(order =>
        order.id === id ? { ...order, ...updates } : order
      ));
    } catch (err) {
      setError('Erreur lors de la mise à jour de la commande');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: SaleStatus) => {
    setLoading(true);
    try {
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { 
          ...order, 
          status,
          ...(status === 'CONFIRME' && !order.confirmedAt && { confirmedAt: new Date() }),
          ...(status === 'LIVRE' && !order.deliveredAt && { deliveredAt: new Date() }),
          ...(status === 'FACTURE' && !order.invoicedAt && { invoicedAt: new Date() })
        } : order
      ));
    } catch (err) {
      setError('Erreur lors du changement de statut');
    } finally {
      setLoading(false);
    }
  };

  const searchSales = (filters: SalesFilter) => {
    const filteredQuotes = quotes.filter(quote => {
      if (filters.status && quote.status !== filters.status) return false;
      if (filters.customerId && quote.customerId !== filters.customerId) return false;
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          quote.quoteNumber.toLowerCase().includes(searchLower) ||
          quote.customerName.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });

    const filteredOrders = orders.filter(order => {
      if (filters.status && order.status !== filters.status) return false;
      if (filters.customerId && order.customerId !== filters.customerId) return false;
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.customerName.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });

    return { quotes: filteredQuotes, orders: filteredOrders };
  };

  const exportSales = (filters: SalesFilter) => {
    const filteredData = searchSales(filters);
    console.log('Exporting sales:', filteredData);
  };

  return {
    quotes,
    orders,
    loading,
    error,
    stats,
    createQuote,
    updateQuote,
    convertQuoteToOrder,
    createOrder,
    updateOrder,
    updateOrderStatus,
    searchSales,
    exportSales
  };
};