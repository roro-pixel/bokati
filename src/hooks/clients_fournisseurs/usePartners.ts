import { useState, useEffect } from 'react';
import { BusinessPartner, PartnerStats, PartnerFilter, UsePartnersReturn, PartnerContact} from '../../types';

// Données mock réalistes harmonisées
const mockPartners: BusinessPartner[] = [
  {
    id: 'CL-2024-001',
    code: 'CL-2024-001',
    type: 'CLIENT',
    name: 'SOGEA SATOM CAMEROUN',
    legalForm: 'SARL',
    taxId: 'M098700123456R',
    rccm: 'CM/CD/2024/B/1234',
    activitySector: 'BTP',
    category: 'VIP',
    address: 'Rue 1.244, Bonanjo Douala',
    city: 'Douala',
    country: 'Cameroun',
    phone: '+237 233 42 42 42',
    email: 'contact@sogeasatom.cm',
    website: 'www.sogeasatom.cm',
    contacts: [
      {
        id: 'ct-001',
        partnerId: 'CL-2024-001',
        firstName: 'Jean',
        lastName: 'Mbarga',
        position: 'Directeur Financier',
        phone: '+237 699 887 766',
        email: 'j.mbarga@sogeasatom.cm',
        isPrimary: true,
        department: 'Finance'
      }
    ],
    chartAccountId: 'acc_411001',
    paymentTerms: '30J',
    paymentMethod: 'VIREMENT',
    creditLimit: 50000000,
    currentBalance: 12500000,
    outstandingBalance: 8500000,
    riskLevel: 'FAIBLE',
    riskScore: 85,
    salesRepresentative: 'Alice Ngo',
    discountRate: 5,
    paymentHistory: [
      {
        id: 'ph-001',
        partnerId: 'CL-2024-001',
        documentNumber: 'FAC-2024-00125',
        documentType: 'FACTURE',
        dueDate: new Date('2024-01-15'),
        paymentDate: new Date('2024-01-10'),
        amount: 4500000,
        status: 'PAYE',
        delayDays: 0
      }
    ],
    documents: [],
    isActive: true,
    entity: 'ENT-001',
    createdAt: new Date('2023-01-15'),
    createdBy: 'admin'
  },
  {
    id: 'FR-2024-001',
    code: 'FR-2024-001',
    type: 'FOURNISSEUR',
    name: 'DISTRIBUTION CAMEROUN SA',
    legalForm: 'SA',
    taxId: 'M051200987654R',
    rccm: 'CM/CD/2023/A/5678',
    activitySector: 'GROSSISTE',
    category: 'STRATEGIQUE',
    address: 'Boulevard de la Liberté, Akwa Douala',
    city: 'Douala',
    country: 'Cameroun',
    phone: '+237 233 43 43 43',
    email: 'achat@distribution-cm.com',
    contacts: [
      {
        id: 'ct-002',
        partnerId: 'FR-2024-001',
        firstName: 'Marie',
        lastName: 'Kemayo',
        position: 'Responsable Achats',
        phone: '+237 677 554 433',
        email: 'm.kemayo@distribution-cm.com',
        isPrimary: true,
        department: 'Achats'
      }
    ],
    chartAccountId: 'acc_401001',
    paymentTerms: '60J',
    paymentMethod: 'VIREMENT',
    creditLimit: 30000000,
    currentBalance: -7800000,
    outstandingBalance: 4500000,
    riskLevel: 'MOYEN',
    riskScore: 65,
    discountRate: 3,
    paymentHistory: [
      {
        id: 'ph-002',
        partnerId: 'FR-2024-001',
        documentNumber: 'FAC-2024-00342',
        documentType: 'FACTURE',
        dueDate: new Date('2024-02-20'),
        amount: 3200000,
        status: 'EN_ATTENTE',
        delayDays: 0
      }
    ],
    documents: [],
    isActive: true,
    entity: 'ENT-001',
    createdAt: new Date('2023-03-10'),
    createdBy: 'admin'
  }
];

const mockStats: PartnerStats = {
  totalClients: 147,
  totalFournisseurs: 89,
  clientsActifs: 132,
  fournisseursActifs: 76,
  totalCreances: 45000000,
  totalDettes: 28000000,
  creanceMoyenne: 340909,
  detteMoyenne: 368421,
  clientsEnRetard: 8,
  fournisseursEnRetard: 3,
  risqueEleve: 5,
  topClients: [
    { name: 'SOGEA SATOM CAMEROUN', amount: 12500000 },
    { name: 'MTN CAMEROUN', amount: 9800000 },
    { name: 'ORANGE CAMEROUN', amount: 8700000 }
  ],
  topFournisseurs: [
    { name: 'DISTRIBUTION CAMEROUN SA', amount: 7800000 },
    { name: 'PRODUITS ALIMENTAIRES SA', amount: 6500000 },
    { name: 'MATERIAUX CONSTRUCTION', amount: 5200000 }
  ]
};

export const usePartners = (): UsePartnersReturn => {
  const [partners, setPartners] = useState<BusinessPartner[]>(mockPartners);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats] = useState<PartnerStats>(mockStats);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPartners(mockPartners);
      setLoading(false);
    }, 1000);
  }, []);

  const createPartner = async (partnerData: Omit<BusinessPartner, 'id' | 'createdAt' | 'createdBy'>) => {
    setLoading(true);
    try {
      const newPartner: BusinessPartner = {
        ...partnerData,
        id: `PT-${Date.now()}`,
        createdAt: new Date(),
        createdBy: 'current-user'
      };
      setPartners(prev => [...prev, newPartner]);
    } catch (err) {
      setError('Erreur lors de la création du partenaire');
    } finally {
      setLoading(false);
    }
  };

  const updatePartner = async (id: string, updates: Partial<BusinessPartner>) => {
    setLoading(true);
    try {
      setPartners(prev => prev.map(partner =>
        partner.id === id 
          ? { ...partner, ...updates, updatedAt: new Date() }
          : partner
      ));
    } catch (err) {
      setError('Erreur lors de la mise à jour du partenaire');
    } finally {
      setLoading(false);
    }
  };

  const updatePartnerContacts = async (partnerId: string, newContacts: PartnerContact[]) => {
    setLoading(true);
    try {
      setPartners(prev => prev.map(partner =>
        partner.id === partnerId 
          ? { ...partner, contacts: newContacts, updatedAt: new Date() }
          : partner
      ));
    } catch (err) {
      setError('Erreur lors de la mise à jour des contacts');
    } finally {
      setLoading(false);
    }
  };

  const deletePartner = async (id: string) => {
    setLoading(true);
    try {
      setPartners(prev => prev.filter(partner => partner.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression du partenaire');
    } finally {
      setLoading(false);
    }
  };

  const getPartnerById = (id: string) => {
    return partners.find(partner => partner.id === id);
  };

  const searchPartners = (filters: PartnerFilter) => {
    return partners.filter(partner => {
      if (filters.type && partner.type !== filters.type) return false;
      if (filters.category && partner.category !== filters.category) return false;
      if (filters.riskLevel && partner.riskLevel !== filters.riskLevel) return false;
      if (filters.isActive !== undefined && partner.isActive !== filters.isActive) return false;
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          partner.name.toLowerCase().includes(searchLower) ||
          partner.taxId.toLowerCase().includes(searchLower) ||
          partner.city.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  };

  const exportPartners = (filters: PartnerFilter) => {
    const filteredPartners = searchPartners(filters);
    console.log('Exporting partners:', filteredPartners);
  };

  return {
    partners,
    loading,
    error,
    stats,
    createPartner,
    updatePartner,
    updatePartnerContacts, // BIEN AJOUTÉE ICI
    deletePartner,
    getPartnerById,
    searchPartners,
    exportPartners
  };
};
