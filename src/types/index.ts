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