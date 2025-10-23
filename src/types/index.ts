// *********************************  Module administration  ***************************************
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  entity: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
  phone?: string;
  department?: string;
}

export interface Entity {
  id: string;
  code: string;
  name: string;
  taxId: string;
  rccmNumber: string;
  niuNumber: string;
  address: string;
  phone: string;
  currency: string;
  country: string;
  accountingSystem: 'Normal' | 'SMT';
  fiscalYearStart: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystemRole: boolean;
}

export interface Permission {
  id: string;
  category: string;
  action: string;
  description: string;
}

export interface NumberSequence {
  id: string;
  name: string;
  prefix: string;
  suffix: string;
  nextValue: number;
  increment: number;
  padding: number;
  resetFrequency: 'never' | 'yearly' | 'monthly';
  entity: string;
  lastResetDate?: Date;
}

export interface SystemParameter {
  id: string;
  key: string;
  value: string;
  description: string;
  dataType: 'string' | 'number' | 'boolean' | 'date';
  entity: string;
}

// Types pour le suivi d'activité
export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  module: string;
  timestamp: Date;
  details?: string;
  ipAddress?: string;
}

export interface LoginAttempt {
  id: string;
  username: string;
  timestamp: Date;
  success: boolean;
  ipAddress: string;
  userAgent?: string;
}

// *********************************  Module authentification  ***************************************
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
  entity: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  phone?: string;
  department?: string;
  lastLogin?: Date;
  createdAt: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// *********************************  Module comptabilité - TYPES DE BASE  ***************************************

export interface Currency {
  code: 'XAF' | 'EUR' | 'USD';
  name: string;
  symbol: string;
  exchangeRate: number;
}

// ==================== MODULE 3 - PLAN COMPTABLE SYSCOHADA ====================

export type AccountClass = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';

export interface ChartAccount {
  id: string;
  code: string; // Format SYSCOHADA: 10, 101, 1011, etc.
  name: string; // Nom en français
  class: AccountClass;
  type: AccountType;
  parentId?: string;
  level: number;
  isAuxiliary: boolean; // Pour comptes clients/fournisseurs
  isReconcilable: boolean; // Pour comptes banque/caisse
  isActive: boolean;
  description?: string;
  entity: string;
  createdAt: Date;
  createdBy: string;
}

export interface AccountBalance {
  accountId: string;
  periodId: string;
  openingDebit: number;
  openingCredit: number;
  periodDebit: number;
  periodCredit: number;
  closingDebit: number;
  closingCredit: number;
}

export interface SYSCOHADAValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  classRules: {
    class: AccountClass;
    minCode: string;
    maxCode: string;
    description: string;
  }[];
}

// ==================== MODULE 4 - GESTION DES JOURNAUX ====================

export type JournalType = 'GEN' | 'VTE' | 'ACH' | 'BNQ' | 'CAI';

export interface Journal {
  id: string;
  code: string; // 3 caractères: GEN, VTE, ACH, etc.
  name: string;
  type: JournalType;
  entity: string;
  sequenceId: string; // Référence à NumberSequence
  isActive: boolean;
  requiresApproval: boolean;
  approvalLevel: number;
  defaultAccounts?: {
    cashAccount?: string;
    bankAccount?: string;
    customerAccount?: string;
    supplierAccount?: string;
  };
  createdAt: Date;
  createdBy: string;
}

export interface JournalStatus {
  journalId: string;
  periodId: string;
  isClosed: boolean;
  totalEntries: number;
  totalDebit: number;
  totalCredit: number;
  closedAt?: Date;
  closedBy?: string;
}

// ==================== MODULE 5 - TRAITEMENT DES ÉCRITURES ====================

export type EntryStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'POSTED' | 'REVERSED';

export type EntryLineType = 'DEBIT' | 'CREDIT';

export interface JournalEntryLine {
  id: string;
  entryId: string;
  accountId: string;
  type: EntryLineType;
  amount: number;
  description: string;
  auxiliaryAccount?: string; // Pour comptes clients/fournisseurs
  reference?: string;
  taxCode?: string;
  createdAt: Date;
}

export interface JournalEntry {
  id: string;
  entryNumber: string; // Numéro séquentiel: JOURNAL-2024-000001
  journalId: string;
  entity: string;
  entryDate: Date;
  accountingDate: Date;
  description: string;
  referenceDocument?: string;
  status: EntryStatus;
  totalDebit: number;
  totalCredit: number;
  lines: JournalEntryLine[];
  submittedBy: string;
  submittedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  postedBy?: string;
  postedAt?: Date;
  reversalOf?: string; // Pour les écritures de contre-passement
  reversalReason?: string;
  createdAt: Date;
  createdBy: string;
}

export interface ApprovalWorkflow {
  id: string;
  entryId: string;
  level: number;
  approverId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  comments?: string;
  approvedAt?: Date;
  requiredAmount: number; // Seuil pour ce niveau d'approbation
}

export interface EntryValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  balanceCheck: {
    isBalanced: boolean;
    debitTotal: number;
    creditTotal: number;
    difference: number;
  };
  periodCheck: {
    isOpen: boolean;
    periodId: string;
  };
  accountChecks: {
    validAccounts: boolean;
    activeAccounts: boolean;
    SYSCOHADACompliant: boolean;
  };
}

// ==================== MODULE 6 - GESTION DES PÉRIODES ====================

export type PeriodStatus = 'OPEN' | 'CLOSED' | 'LOCKED';

export interface FiscalYear {
  id: string;
  year: string; // "2024"
  startDate: Date;
  endDate: Date;
  entity: string;
  isClosed: boolean;
  closedAt?: Date;
  closedBy?: string;
  createdAt: Date;
  createdBy: string;
}

export interface AccountingPeriod {
  id: string;
  fiscalYearId: string;
  periodNumber: number; // 1-12 (13 pour ajustements)
  name: string; // "Janvier 2024"
  startDate: Date;
  endDate: Date;
  status: PeriodStatus;
  isAdjustmentPeriod: boolean;
  closedAt?: Date;
  closedBy?: string;
  createdAt: Date;
}

export interface PeriodClosingCheck {
  periodId: string;
  checks: {
    allEntriesPosted: boolean;
    bankReconciliationsComplete: boolean;
    depreciationCalculated: boolean;
    accrualsRecorded: boolean;
    noOpenJournals: boolean;
  };
  errors: string[];
  warnings: string[];
  canClose: boolean;
}

export interface FiscalYearSetup {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'inactive' | 'closed';
  isActive: boolean;
  entity: string;
  createdAt: Date;
  updatedAt?: Date;
  createdBy: string;
}


// ==================== MODULE 8 - TRÉSORERIE ====================

export type BankAccountType = 'CHECKING' | 'SAVINGS' | 'PAYROLL' | 'TAX' | 'INVESTMENT';

export interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  accountType: BankAccountType;
  currency: string;
  swiftCode?: string;
  chartAccountId: string; // Lien vers compte 52x
  entity: string;
  isActive: boolean;
  openingBalance: number;
  currentBalance: number;
  overdraftLimit: number;
  contactInfo?: {
    address: string;
    phone: string;
    email: string;
    accountManager: string;
  };
  createdAt: Date;
  createdBy: string;
}

export interface BankTransaction {
  id: string;
  bankAccountId: string;
  transactionDate: Date;
  valueDate: Date;
  description: string;
  reference: string;
  amount: number;
  balance: number;
  isReconciled: boolean;
  journalEntryId?: string;
  matchedById?: string;
  createdAt: Date;
}

export interface BankReconciliation {
  id: string;
  bankAccountId: string;
  periodId: string;
  statementDate: Date;
  statementBalance: number;
  bookBalance: number;
  reconciledBalance: number;
  outstandingDeposits: number;
  outstandingChecks: number;
  bankCharges: number;
  interestEarned: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  reconciledAt?: Date;
  reconciledBy?: string;
  createdAt: Date;
}

export interface CashFlowForecast {
  id: string;
  entity: string;
  forecastDate: Date;
  periodType: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  cashPosition: {
    beginningBalance: number;
    expectedReceipts: number;
    expectedPayments: number;
    endingBalance: number;
  };
  details: {
    category: string;
    description: string;
    amount: number;
    type: 'RECEIPT' | 'PAYMENT';
    probability: number; // 0-100%
  }[];
  createdAt: Date;
  createdBy: string;
}

// ==================== MODULE 10 - ÉTATS FINANCIERS ====================

export interface FinancialStatement {
  id: string;
  type: 'BALANCE_SHEET' | 'INCOME_STATEMENT' | 'CASH_FLOW';
  periodId: string;
  entity: string;
  generatedAt: Date;
  generatedBy: string;
  data: BalanceSheetData | IncomeStatementData | CashFlowData;
}

export interface BalanceSheetData {
  actif: {
    immobilise: {
      fraisEtablissement: number;
      chargesRepartir: number;
      primesRemboursement: number;
      immobilisationsIncorporelles: number;
      immobilisationsCorporelles: number;
      avancesAcomptes: number;
      immobilisationsFinancieres: number;
    };
    circulant: {
      stocks: number;
      creancesEmploisAssimiles: number;
      tresorerieActif: number;
    };
  };
  passif: {
    ressourcesDurables: {
      capital: number;
      primesReserves: number;
      resultatNet: number;
      autresCapitauxPropres: number;
      dettesFinancieres: number;
      provisionsRisquesCharges: number;
    };
    circulant: {
      dettesCirculantes: number;
      tresoreriePassif: number;
    };
  };
}

export interface IncomeStatementData {
  charges: {
    exploitation: {
      achatsMarchandises: number;
      variationStocksMarchandises: number;
      achatsMatièresPremieres: number;
      variationStocksMatieres: number;
      autresAchats: number;
      variationStocksAutres: number;
      transports: number;
      servicesExterieurs: number;
      impotsTaxes: number;
      autresCharges: number;
    };
    financieres: number;
    hao: number;
    participationTravailleurs: number;
    impotsResultat: number;
  };
  produits: {
    exploitation: {
      ventesMarchandises: number;
      ventesProduitsFabriques: number;
      travauxServicesVendus: number;
      productionStockee: number;
      productionImmobilisee: number;
      subventionsExploitation: number;
      autresProduits: number;
      reprisesProvisions: number;
    };
    financiers: number;
    hao: number;
  };
  soldesIntermediaires: {
    margeCommerciale: number;
    valeurAjoutee: number;
    ebe: number;
    resultatExploitation: number;
    resultatFinancier: number;
    resultatActivitesOrdinaires: number;
    resultatHAO: number;
    resultatNet: number;
  };
}

export interface CashFlowData {
  activites: {
    exploitation: number;
    investissement: number;
    financement: number;
  };
  variationTresorerie: number;
  soldeOuverture: number;
  soldeCloture: number;
}

// ==================== TYPES POUR RAPPORTS ====================

export interface AgedReceivable {
  customerId: string;
  customerName: string;
  current: number;
  days30: number;
  days60: number;
  days90: number;
  days120: number;
  total: number;
  provision: number;
}

export interface AgedPayable {
  supplierId: string;
  supplierName: string;
  notDue: number;
  days30: number;
  days60: number;
  days90: number;
  over90: number;
  total: number;
}

export interface TrialBalance {
  accountId: string;
  accountCode: string;
  accountName: string;
  openingDebit: number;
  openingCredit: number;
  periodDebit: number;
  periodCredit: number;
  closingDebit: number;
  closingCredit: number;
}

// ==================== TYPES POUR COMPTABILITÉ AUXILIAIRE ====================

export interface Customer {
  id: string;
  code: string;
  name: string;
  taxId: string;
  address: string;
  phone: string;
  email: string;
  paymentTerms: string;
  creditLimit: number;
  currentBalance: number;
  chartAccountId: string;
  entity: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  taxId: string;
  address: string;
  phone: string;
  email: string;
  paymentTerms: string;
  bankAccount?: string;
  chartAccountId: string;
  entity: string;
  isActive: boolean;
  createdAt: Date;
}

// ==================== TYPES POUR LES HOOKS ====================

export interface UseChartOfAccountsReturn {
  accounts: ChartAccount[];
  loading: boolean;
  error: string | null;
  createAccount: (account: Omit<ChartAccount, 'id' | 'createdAt' | 'createdBy'>) => Promise<void>;
  updateAccount: (id: string, updates: Partial<ChartAccount>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  validateSYSCOHADA: (account: ChartAccount) => SYSCOHADAValidation;
  searchAccounts: (query: string) => ChartAccount[];
  getAccountHierarchy: () => { [key: string]: ChartAccount[] };
}

export interface UseTransactionProcessingReturn {
  entries: JournalEntry[];
  loading: boolean;
  error: string | null;
  createEntry: (entry: Omit<JournalEntry, 'id' | 'entryNumber' | 'status' | 'createdAt' | 'createdBy'>) => Promise<void>;
  submitForApproval: (entryId: string) => Promise<void>;
  approveEntry: (entryId: string, comments?: string) => Promise<void>;
  rejectEntry: (entryId: string, comments: string) => Promise<void>;
  postEntry: (entryId: string) => Promise<void>;
  reverseEntry: (entryId: string, reason: string) => Promise<void>;
  validateEntry: (entry: JournalEntry) => EntryValidationResult;
}

export interface UsePeriodManagementReturn {
  fiscalYears: FiscalYear[];
  periods: AccountingPeriod[];
  loading: boolean;
  error: string | null;
  createFiscalYear: (year: Omit<FiscalYear, 'id' | 'isClosed' | 'createdAt' | 'createdBy'>) => Promise<void>;
  closePeriod: (periodId: string) => Promise<void>;
  reopenPeriod: (periodId: string, reason: string) => Promise<void>;
  closeFiscalYear: (yearId: string) => Promise<void>;
  getPeriodStatus: (periodId: string) => PeriodClosingCheck;
}

// ==================== TYPES POUR ÉDITION COMPTABLE ====================

export type ReportType = 'TRIAL_BALANCE' | 'GENERAL_LEDGER' | 'BALANCE_SHEET' | 'INCOME_STATEMENT' | 'CASH_FLOW';

export interface ReportFilter {
  periodId: string;
  startDate?: Date;
  endDate?: Date;
  accountCodes?: string[];
  journalIds?: string[];
  includePostedOnly: boolean;
  includeDraft: boolean;
}

export interface GeneralLedgerEntry {
  id: string;
  entryId: string;
  entryNumber: string;
  entryDate: Date;
  journalCode: string;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  status: EntryStatus;
  auxiliaryAccount?: string;
}

export interface GeneralLedgerReport {
  accountCode: string;
  accountName: string;
  openingDebit: number;
  openingCredit: number;
  entries: GeneralLedgerEntry[];
  totalDebit: number;
  totalCredit: number;
  closingDebit: number;
  closingCredit: number;
}

export interface AnomalyReport {
  id: string;
  type: 'UNBALANCED_ENTRY' | 'SUSPENSE_ACCOUNT' | 'INACTIVE_ACCOUNT' | 'PERIOD_CLOSED' | 'VALIDATION_ERROR';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  details: string;
  affectedEntries?: string[];
  affectedAccounts?: string[];
  detectedAt: Date;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

// ==================== MODULE CLIENTS & FOURNISSEURS ====================

export type BusinessPartnerType = 'CLIENT' | 'FOURNISSEUR';
export type LegalForm = 'SARL' | 'SA' | 'EI' | 'SNC' | 'GIE' | 'AUTRE';
export type RiskLevel = 'FAIBLE' | 'MOYEN' | 'ELEVE';
export type PartnerCategory = 'STANDARD' | 'VIP' | 'STRATEGIQUE' | 'RISQUE';
export type PaymentTerms = 'IMMEDIAT' | '30J' | '60J' | '90J' | '120J';
export type PaymentMethod = 'VIREMENT' | 'CHEQUE' | 'CASH' | 'MOBILE' | 'CREDIT';

export interface BusinessPartner {
  id: string;
  code: string;
  type: BusinessPartnerType;
  name: string;
  legalForm: LegalForm;
  taxId: string;
  rccm?: string;
  activitySector: string;
  category: PartnerCategory;
  
  // Coordonnées
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  
  // Contacts multiples
  contacts: PartnerContact[];
  
  // Comptabilité
  chartAccountId: string;
  paymentTerms: PaymentTerms;
  paymentMethod: PaymentMethod;
  
  // Limites et risques
  creditLimit: number;
  currentBalance: number;
  outstandingBalance: number;
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  
  // Commercial
  salesRepresentative?: string;
  discountRate: number;
  paymentHistory: PaymentHistory[];
  
  // Documents
  documents: PartnerDocument[];
  
  // Statut
  isActive: boolean;
  entity: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
}

export interface PartnerContact {
  id: string;
  partnerId: string;
  firstName: string;
  lastName: string;
  position: string;
  phone: string;
  email: string;
  isPrimary: boolean;
  department?: string;
  notes?: string;
}
export interface PaymentHistory {
  id: string;
  partnerId: string;
  documentNumber: string;
  documentType: 'FACTURE' | 'AVOIR' | 'REGLEMENT';
  dueDate: Date;
  paymentDate?: Date;
  amount: number;
  status: 'PAYE' | 'EN_RETARD' | 'EN_ATTENTE';
  delayDays: number;
}

export interface PartnerDocument {
  id: string;
  partnerId: string;
  type: 'CONTRAT' | 'KYC' | 'RIB' | 'ATTESTATION' | 'AUTRE';
  name: string;
  fileUrl: string;
  uploadDate: Date;
  uploadedBy: string;
}

export interface PartnerContract {
  id: string;
  partnerId: string;
  contractNumber: string;
  type: 'VENTE' | 'SERVICE' | 'MAINTENANCE' | 'APPROVISIONNEMENT';
  startDate: Date;
  endDate: Date;
  amount: number;
  status: 'ACTIF' | 'EXPIRE' | 'RESILIE';
  renewalDate?: Date;
  terms: string;
  documents: string[];
  createdAt: Date;
  createdBy: string;
}

// Statistiques pour le dashboard
export interface PartnerStats {
  totalClients: number;
  totalFournisseurs: number;
  clientsActifs: number;
  fournisseursActifs: number;
  totalCreances: number;
  totalDettes: number;
  creanceMoyenne: number;
  detteMoyenne: number;
  clientsEnRetard: number;
  fournisseursEnRetard: number;
  risqueEleve: number;
  topClients: { name: string; amount: number }[];
  topFournisseurs: { name: string; amount: number }[];
}

// Filtres pour la recherche
export interface PartnerFilter {
  type?: BusinessPartnerType;
  category?: PartnerCategory;
  riskLevel?: RiskLevel;
  activitySector?: string;
  city?: string;
  isActive?: boolean;
  searchTerm?: string;
}

// Hook return types
export interface UsePartnersReturn {
  partners: BusinessPartner[];
  loading: boolean;
  error: string | null;
  stats: PartnerStats;
  createPartner: (partner: Omit<BusinessPartner, 'id' | 'createdAt' | 'createdBy'>) => Promise<void>;
  updatePartner: (id: string, updates: Partial<BusinessPartner>) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;
  getPartnerById: (id: string) => BusinessPartner | undefined;
  searchPartners: (filters: PartnerFilter) => BusinessPartner[];
  exportPartners: (filters: PartnerFilter) => void;
  updatePartnerContacts: (partnerId: string, newContacts: PartnerContact[]) => Promise<void>;
}


// ==================== MODULE PRODUITS & TARIFICATION ====================

export type ProductType = 'PRODUIT' | 'SERVICE' | 'MATIERE' | 'IMMOBILISATION';
export type TaxType = 'EXONERE' | 'TVA_5.5' | 'TVA_19.25' | 'SPECIFIQUE';
export type StockManagement = 'AUCUN' | 'SUIVI' | 'LOT' | 'SERIE';
export type PricingMethod = 'FIXE' | 'VARIABLE' | 'PROMOTION' | 'QUANTITE';

export interface ProductCategory {
  id: string;
  code: string;
  name: string;
  description?: string;
  parentId?: string;
  level: number;
  isActive: boolean;
  entity: string;
  createdAt: Date;
  createdBy: string;
}

export interface Product {
  id: string;
  code: string; // Auto-généré: PROD-2024-001
  reference: string; // Référence fournisseur
  type: ProductType;
  name: string;
  description?: string;
  
  // Catégorisation
  categoryId: string;
  subCategoryId?: string;
  brand?: string;
  model?: string;
  
  // Comptabilité
  chartAccountId: string; // Compte de charge/produit
  taxCode: TaxType;
  
  // Stocks
  stockManagement: StockManagement;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  reservedStock: number;
  availableStock: number;
  
  // Unités
  purchaseUnit: string; // Unité d'achat
  salesUnit: string; // Unité de vente
  conversionFactor: number; // Facteur conversion achat→vente
  
  // Prix
  costPrice: number; // Prix d'achat moyen
  standardPrice: number; // Prix de vente standard
  pricingMethod: PricingMethod;
  
  // Images et documents
  images: ProductImage[];
  documents: ProductDocument[];
  
  // Statut
  isActive: boolean;
  isPurchasable: boolean;
  isSellable: boolean;
  entity: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  uploadedAt: Date;
}

export interface ProductDocument {
  id: string;
  productId: string;
  type: 'FICHE_TECHNIQUE' | 'MANUEL' | 'CERTIFICAT' | 'AUTRE';
  name: string;
  fileUrl: string;
  uploadDate: Date;
}

export interface PriceList {
  id: string;
  name: string;
  description?: string;
  currency: string;
  isDefault: boolean;
  validFrom: Date;
  validUntil?: Date;
  prices: PriceListItem[];
  entity: string;
  createdAt: Date;
  createdBy: string;
}

export interface PriceListItem {
  id: string;
  priceListId: string;
  productId: string;
  unitPrice: number;
  minimumQuantity: number;
  validFrom: Date;
  validUntil?: Date;
  isActive: boolean;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'ENTREE' | 'SORTIE' | 'INVENTAIRE' | 'AJUSTEMENT';
  quantity: number;
  unitCost: number;
  documentNumber?: string; // Numéro bon de commande, facture, etc.
  reference?: string;
  location?: string;
  reason?: string;
  movementDate: Date;
  createdAt: Date;
  createdBy: string;
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  lowStock: number;
  totalStockValue: number;
  averageCost: number;
  topSelling: { product: string; quantity: number }[];
  categories: { category: string; count: number }[];
}

export interface ProductFilter {
  type?: ProductType;
  categoryId?: string;
  stockStatus?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  isActive?: boolean;
  searchTerm?: string;
}

export interface UseProductsReturn {
  products: Product[];
  categories: ProductCategory[];
  priceLists: PriceList[];
  loading: boolean;
  error: string | null;
  stats: ProductStats;
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'createdBy'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  searchProducts: (filters: ProductFilter) => Product[];
  updateStock: (productId: string, quantity: number, reason: string) => Promise<void>;
  exportProducts: (filters: ProductFilter) => void;
}

// ==================== MODULE VENTES ====================

export type SaleStatus = 'BROUILLON' | 'EN_ATTENTE' | 'CONFIRME' | 'LIVRE' | 'FACTURE' | 'ANNULE';
export type QuoteStatus = 'BROUILLON' | 'ENVOYE' | 'ACCEPTE' | 'REFUSE' | 'EXPIRE';
export type DeliveryStatus = 'EN_PREPARATION' | 'PARTIELLEMENT_LIVRE' | 'LIVRE' | 'RETOUR';

export interface SaleQuote {
  id: string;
  quoteNumber: string; // DEV-2024-001
  customerId: string;
  customerName: string;
  quoteDate: Date;
  validUntil: Date;
  status: QuoteStatus;
  
  // Lignes du devis
  items: SaleItem[];
  
  // Totaux
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  
  // Conditions
  paymentTerms: string;
  deliveryTerms: string;
  notes?: string;
  
  // Suivi
  sentAt?: Date;
  acceptedAt?: Date;
  entity: string;
  createdAt: Date;
  createdBy: string;
}

export interface SaleOrder {
  id: string;
  orderNumber: string; // CMD-2024-001
  quoteId?: string; // Si issu d'un devis
  customerId: string;
  customerName: string;
  orderDate: Date;
  status: SaleStatus;
  
  // Lignes de commande
  items: SaleItem[];
  
  // Livraison
  deliveryAddress: string;
  deliveryDate?: Date;
  deliveryStatus: DeliveryStatus;
  
  // Totaux
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  
  // Paiement
  paymentMethod: string;
  paidAmount: number;
  dueAmount: number;
  
  // Suivi
  confirmedAt?: Date;
  deliveredAt?: Date;
  invoicedAt?: Date;
  entity: string;
  createdAt: Date;
  createdBy: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  discountRate: number;
  taxRate: number;
  
  // Calculés
  discountAmount: number;
  taxAmount: number;
  lineTotal: number;
}

export interface DeliveryNote {
  id: string;
  deliveryNumber: string; // BL-2024-001
  orderId: string;
  customerId: string;
  deliveryDate: Date;
  items: DeliveryItem[];
  status: DeliveryStatus;
  notes?: string;
  preparedBy: string;
  deliveredBy?: string;
  entity: string;
  createdAt: Date;
}

export interface DeliveryItem {
  id: string;
  productId: string;
  productName: string;
  orderedQuantity: number;
  deliveredQuantity: number;
  unit: string;
}

export interface SalesStats {
  totalQuotes: number;
  quotesThisMonth: number;
  quoteConversionRate: number;
  totalOrders: number;
  ordersThisMonth: number;
  totalRevenue: number;
  revenueThisMonth: number;
  averageOrderValue: number;
  pendingOrders: number;
  topCustomers: { customer: string; amount: number }[];
  topProducts: { product: string; quantity: number }[];
}

export interface SalesFilter {
  status?: SaleStatus | QuoteStatus;
  customerId?: string;
  dateRange?: [Date, Date];
  searchTerm?: string;
}

export interface UseSalesReturn {
  quotes: SaleQuote[];
  orders: SaleOrder[];
  loading: boolean;
  error: string | null;
  stats: SalesStats;
  createQuote: (quote: Omit<SaleQuote, 'id' | 'quoteNumber' | 'createdAt' | 'createdBy'>) => Promise<void>;
  updateQuote: (id: string, updates: Partial<SaleQuote>) => Promise<void>;
  convertQuoteToOrder: (quoteId: string) => Promise<void>;
  createOrder: (order: Omit<SaleOrder, 'id' | 'orderNumber' | 'createdAt' | 'createdBy'>) => Promise<void>;
  updateOrder: (id: string, updates: Partial<SaleOrder>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: SaleStatus) => Promise<void>;
  searchSales: (filters: SalesFilter) => { quotes: SaleQuote[]; orders: SaleOrder[] };
  exportSales: (filters: SalesFilter) => void;
}