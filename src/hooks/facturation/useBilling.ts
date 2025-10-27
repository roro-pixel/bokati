import { useState, useEffect } from 'react';
import { Invoice, Payment, CreditNote, BillingStats, BillingFilter, UseBillingReturn, InvoiceItem } from '../../types';

// Données mock réalistes
const mockInvoices: Invoice[] = [
  {
    id: 'invoice-001',
    invoiceNumber: 'FAC-2024-001',
    type: 'VENTE',
    customerId: 'CL-2024-001',
    customerName: 'SOGEA SATOM CAMEROUN',
    customerAddress: 'Rue 1.244, Bonanjo Douala',
    customerTaxId: 'M098700123456R',
    orderId: 'order-001',
    invoiceDate: new Date('2024-01-25'),
    dueDate: new Date('2024-02-24'),
    status: 'EMISE',
    paymentStatus: 'EN_ATTENTE',
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
    discountAmount: 162500,
    taxAmount: 625625,
    totalAmount: 3713125,
    paidAmount: 0,
    dueAmount: 3713125,
    paymentTerms: '30 jours',
    entity: 'ENT-001',
    createdAt: new Date('2024-01-25'),
    createdBy: 'admin'
  }
];

const mockPayments: Payment[] = [
  {
    id: 'payment-001',
    invoiceId: 'invoice-001',
    paymentNumber: 'PAI-2024-001',
    paymentDate: new Date('2024-02-15'),
    amount: 2000000,
    paymentMethod: 'VIREMENT',
    reference: 'VIR-SOGEA-001',
    bankAccount: 'BNK-001',
    notes: 'Acompte reçu',
    recordedBy: 'admin',
    entity: 'ENT-001',
    createdAt: new Date('2024-02-15')
  }
];

const mockCreditNotes: CreditNote[] = [
  {
    id: 'credit-001',
    creditNoteNumber: 'AVR-2024-001',
    invoiceId: 'invoice-001',
    customerId: 'CL-2024-001',
    issueDate: new Date('2024-02-01'),
    reason: 'Retour matériel défectueux',
    items: [
      {
        id: 'item-001',
        productId: 'PROD-2024-001',
        productName: 'Ordinateur Portable Dell Latitude 5420',
        quantity: 1,
        unitPrice: 650000,
        reason: 'Écran défectueux',
        lineTotal: 650000
      }
    ],
    totalAmount: 650000,
    status: 'EMIS',
    entity: 'ENT-001',
    createdAt: new Date('2024-02-01'),
    createdBy: 'admin'
  }
];

const mockStats: BillingStats = {
  totalInvoices: 156,
  invoicesThisMonth: 23,
  totalRevenue: 485000000,
  revenueThisMonth: 75000000,
  outstandingAmount: 125000000,
  overdueAmount: 35000000,
  averagePaymentTime: 28,
  paymentRate: 74,
  topCustomers: [
    { customer: 'SOGEA SATOM CAMEROUN', amount: 85000000 },
    { customer: 'MTN CAMEROUN', amount: 72000000 },
    { customer: 'ORANGE CAMEROUN', amount: 68000000 }
  ],
  agingReceivables: {
    current: 65000000,
    days30: 35000000,
    days60: 18000000,
    days90: 7000000,
    over90: 0
  }
};

export const useBilling = (): UseBillingReturn => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>(mockCreditNotes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats] = useState<BillingStats>(mockStats);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setInvoices(mockInvoices);
      setPayments(mockPayments);
      setCreditNotes(mockCreditNotes);
      setLoading(false);
    }, 1000);
  }, []);

  const createInvoice = async (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'createdBy'>) => {
    setLoading(true);
    try {
      const newInvoice: Invoice = {
        ...invoiceData,
        id: `invoice-${Date.now()}`,
        invoiceNumber: `FAC-2024-${String(invoices.length + 1).padStart(3, '0')}`,
        createdAt: new Date(),
        createdBy: 'current-user'
      };
      setInvoices(prev => [...prev, newInvoice]);
    } catch (err) {
      setError('Erreur lors de la création de la facture');
    } finally {
      setLoading(false);
    }
  };

  const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
    setLoading(true);
    try {
      setInvoices(prev => prev.map(invoice =>
        invoice.id === id ? { ...invoice, ...updates } : invoice
      ));
    } catch (err) {
      setError('Erreur lors de la mise à jour de la facture');
    } finally {
      setLoading(false);
    }
  };

  const sendInvoice = async (invoiceId: string) => {
    setLoading(true);
    try {
      setInvoices(prev => prev.map(invoice =>
        invoice.id === invoiceId ? { 
          ...invoice, 
          status: 'ENVOYEE',
          sentAt: new Date()
        } : invoice
      ));
    } catch (err) {
      setError('Erreur lors de l\'envoi de la facture');
    } finally {
      setLoading(false);
    }
  };

  const recordPayment = async (paymentData: Omit<Payment, 'id' | 'paymentNumber' | 'createdAt'>) => {
    setLoading(true);
    try {
      const newPayment: Payment = {
        ...paymentData,
        id: `payment-${Date.now()}`,
        paymentNumber: `PAI-2024-${String(payments.length + 1).padStart(3, '0')}`,
        createdAt: new Date()
      };
      
      setPayments(prev => [...prev, newPayment]);

      // Mettre à jour le statut de la facture
      const invoice = invoices.find(inv => inv.id === paymentData.invoiceId);
      if (invoice) {
        const newPaidAmount = invoice.paidAmount + paymentData.amount;
        const newDueAmount = invoice.totalAmount - newPaidAmount;
        
        let newPaymentStatus: any = 'PARTIEL';
        if (newDueAmount <= 0) {
          newPaymentStatus = 'PAYE';
        } else if (new Date() > invoice.dueDate) {
          newPaymentStatus = 'EN_RETARD';
        }

        updateInvoice(paymentData.invoiceId, {
          paidAmount: newPaidAmount,
          dueAmount: newDueAmount,
          paymentStatus: newPaymentStatus,
          ...(newDueAmount <= 0 && { paidAt: new Date() })
        });
      }
    } catch (err) {
      setError('Erreur lors de l\'enregistrement du paiement');
    } finally {
      setLoading(false);
    }
  };

  const createCreditNote = async (creditNoteData: Omit<CreditNote, 'id' | 'creditNoteNumber' | 'createdAt' | 'createdBy'>) => {
    setLoading(true);
    try {
      const newCreditNote: CreditNote = {
        ...creditNoteData,
        id: `credit-${Date.now()}`,
        creditNoteNumber: `AVR-2024-${String(creditNotes.length + 1).padStart(3, '0')}`,
        createdAt: new Date(),
        createdBy: 'current-user'
      };
      setCreditNotes(prev => [...prev, newCreditNote]);
    } catch (err) {
      setError('Erreur lors de la création de l\'avoir');
    } finally {
      setLoading(false);
    }
  };

  const searchInvoices = (filters: BillingFilter) => {
    return invoices.filter(invoice => {
      if (filters.status && invoice.status !== filters.status) return false;
      if (filters.type && invoice.type !== filters.type) return false;
      if (filters.customerId && invoice.customerId !== filters.customerId) return false;
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
          invoice.customerName.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  };

  const exportInvoices = (filters: BillingFilter) => {
    const filteredInvoices = searchInvoices(filters);
    console.log('Exporting invoices:', filteredInvoices);
  };

  const generatePDF = async (invoiceId: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`/pdf/invoice-${invoiceId}.pdf`);
      }, 1000);
    });
  };

  return {
    invoices,
    payments,
    creditNotes,
    loading,
    error,
    stats,
    createInvoice,
    updateInvoice,
    sendInvoice,
    recordPayment,
    createCreditNote,
    searchInvoices,
    exportInvoices,
    generatePDF
  };
};