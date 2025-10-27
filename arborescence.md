# File Tree: compta_pro

**Generated:** 10/26/2025, 7:03:55 PM
**Root Path:** `c:\Users\user\OneDrive\Documents\compta_pro`

```
├── 📁 src
│   ├── 📁 components
│   │   ├── 📁 administration
│   │   │   ├── 📄 EntityForm.tsx
│   │   │   ├── 📄 NumberSequenceConfig.tsx
│   │   │   ├── 📄 RoleMatrix.tsx
│   │   │   └── 📄 UserForm.tsx
│   │   ├── 📁 auth
│   │   │   └── 📄 ProtectedRoute.tsx
│   │   ├── 📁 charts
│   │   │   ├── 📄 BarChart.tsx
│   │   │   └── 📄 PieChart.tsx
│   │   ├── 📁 comptabilite
│   │   │   ├── 📁 comptesPage
│   │   │   │   ├── 📄 AccountHierarchy.tsx
│   │   │   │   ├── 📄 ComptaCreerCompte.tsx
│   │   │   │   ├── 📄 ComptaImporterComptes.tsx
│   │   │   │   ├── 📄 ComptaListeComptesTiers.tsx
│   │   │   │   ├── 📄 ComptaPlanComptable.tsx
│   │   │   │   ├── 📄 ComptaRechercheCompte.tsx
│   │   │   │   └── 📄 SYSCOHADAValidator.tsx
│   │   │   ├── 📁 configurationPage
│   │   │   │   ├── 📄 ComptaAutorisations.tsx
│   │   │   │   ├── 📄 ComptaBalanceConfig.tsx
│   │   │   │   ├── 📄 ComptaClotureBalance.tsx
│   │   │   │   ├── 📄 ComptaConfigComptes.tsx
│   │   │   │   ├── 📄 ComptaConfigJournaux.tsx
│   │   │   │   └── 📄 ComptaParametresDossier.tsx
│   │   │   ├── 📁 editionPage
│   │   │   │   ├── 📄 ComptaEditerEtatComptable.tsx
│   │   │   │   ├── 📄 ComptaEditerEtatFinancier.tsx
│   │   │   │   ├── 📄 ComptaRapportAnomalies.tsx
│   │   │   │   └── 📄 comptaLivreJournal.tsx
│   │   │   ├── 📁 journalPage
│   │   │   │   ├── 📄 JournalClosing.tsx
│   │   │   │   ├── 📄 JournalConfiguration.tsx
│   │   │   │   ├── 📄 JournalCreation.tsx
│   │   │   │   └── 📄 JournalTypeSelector.tsx
│   │   │   ├── 📁 parametresAvancesPage
│   │   │   │   ├── 📄 ComptaImportations.tsx
│   │   │   │   ├── 📄 ComptaRapprocheBancaire.tsx
│   │   │   │   └── 📄 ComptaRegenererPeriode.tsx
│   │   │   ├── 📁 periodePage
│   │   │   │   ├── 📄 FiscalYearSetup.tsx
│   │   │   │   ├── 📄 PeriodClosing.tsx
│   │   │   │   ├── 📄 PeriodManagement.tsx
│   │   │   │   └── 📄 YearEndProcess.tsx
│   │   │   └── 📁 saisiePage
│   │   │       ├── 📄 ApprovalWorkflow.tsx
│   │   │       ├── 📄 BatchProcessing.tsx
│   │   │       ├── 📄 ComptaAjoutPieceSuccessive.tsx
│   │   │       ├── 📄 ComptaOptionsMenuSuperieur.tsx
│   │   │       ├── 📄 ComptaSaisieActions.tsx
│   │   │       ├── 📄 ComptaSaisieCompletePiece.tsx
│   │   │       ├── 📄 ComptaSaisiePieceComptable.tsx
│   │   │       └── 📄 EntryValidation.tsx
│   │   ├── 📁 facturation
│   │   │   ├── 📄 BillingStatsCards.tsx
│   │   │   ├── 📄 InvoicesTable.tsx
│   │   │   └── 📄 PaymentsTable.tsx
│   │   ├── 📁 finance
│   │   │   ├── 📁 budget
│   │   │   │   ├── 📄 FinBudgetChart.tsx
│   │   │   │   └── 📄 FinCategorySelector.tsx
│   │   │   ├── 📁 engagement
│   │   │   │   ├── 📄 FinEngagementForm.tsx
│   │   │   │   └── 📄 FinTypeBadge.tsx
│   │   │   └── 📁 tresorerie
│   │   │       ├── 📄 BankReconciliation.tsx
│   │   │       ├── 📄 CashFlowForecast.tsx
│   │   │       ├── 📄 CashPositionMonitor.tsx
│   │   │       ├── 📄 FinAccountSelector.tsx
│   │   │       └── 📄 FinTransactionFlow.tsx
│   │   ├── 📁 immobilisation
│   │   │   ├── 📄 ImmoAmortissementChart.tsx
│   │   │   ├── 📄 ImmoListTable.tsx
│   │   │   └── 📄 ImmoSaisieForm.tsx
│   │   ├── 📁 layout
│   │   │   ├── 📄 Header.tsx
│   │   │   ├── 📄 Layout.tsx
│   │   │   └── 📄 Sidebar.tsx
│   │   ├── 📁 partners
│   │   │   ├── 📄 PartnerContacts.tsx
│   │   │   ├── 📄 PartnerForm.tsx
│   │   │   ├── 📄 PartnerStatsCards.tsx
│   │   │   └── 📄 PartnersTable.tsx
│   │   ├── 📁 products
│   │   │   ├── 📄 ProductForm.tsx
│   │   │   ├── 📄 ProductStatsCards.tsx
│   │   │   └── 📄 ProductsTable.tsx
│   │   ├── 📁 ui
│   │   │   └── 📄 Card.tsx
│   │   └── 📁 ventes
│   │       ├── 📄 SalesOrdersTable.tsx
│   │       ├── 📄 SalesQuotesTable.tsx
│   │       └── 📄 SalesStatsCards.tsx
│   ├── 📁 hooks
│   │   ├── 📁 administration
│   │   │   ├── 📄 useEntityManagement.ts
│   │   │   ├── 📄 useSystemConfig.ts
│   │   │   └── 📄 useUserManagement.ts
│   │   ├── 📁 authentification
│   │   │   └── 📄 useAuth.tsx
│   │   ├── 📁 clients_fournisseurs
│   │   │   └── 📄 usePartners.ts
│   │   ├── 📁 comptabilite
│   │   │   ├── 📁 module_five
│   │   │   │   ├── 📄 useAnomalyReports.ts
│   │   │   │   ├── 📄 useApprovalWorkflow.ts
│   │   │   │   ├── 📄 useEntryValidation.ts
│   │   │   │   └── 📄 useTransactionProcessing.ts
│   │   │   ├── 📁 module_four
│   │   │   │   ├── 📄 useJournalManagement.ts
│   │   │   │   └── 📄 useJournalValidation.ts
│   │   │   ├── 📁 module_height
│   │   │   │   └── 📄 useBankReconciliation.ts
│   │   │   ├── 📁 module_six
│   │   │   │   ├── 📄 useFiscalYear.ts
│   │   │   │   ├── 📄 usePeriodManagement.ts
│   │   │   │   └── 📄 usePeriodRegeneration.ts
│   │   │   ├── 📁 module_ten
│   │   │   │   ├── 📄 useFinancialReports.ts
│   │   │   │   └── 📄 useGeneralLedger.ts
│   │   │   └── 📁 module_three
│   │   │       ├── 📄 useAccountConfiguration.ts
│   │   │       ├── 📄 useAccountValidation.ts
│   │   │       ├── 📄 useBalanceConfiguration.ts
│   │   │       ├── 📄 useChartOfAccounts.ts
│   │   │       ├── 📄 useDataImport.ts
│   │   │       └── 📄 useSYSCOHADACompliance.ts
│   │   ├── 📁 facturation
│   │   │   └── 📄 useBilling.ts
│   │   ├── 📁 finance
│   │   │   ├── 📁 module_height
│   │   │   │   ├── 📄 useBankAccounts.ts
│   │   │   │   ├── 📄 useCashFlow.ts
│   │   │   │   └── 📄 useTreasuryManagement.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 immobilisattion
│   │   ├── 📁 products
│   │   │   └── 📄 useProducts.ts
│   │   ├── 📁 provision_regulation
│   │   └── 📁 ventes
│   │       └── 📄 useSales.ts
│   ├── 📁 pages
│   │   ├── 📁 authentification
│   │   │   └── 📄 Login.tsx
│   │   ├── 📁 client_fournisseur
│   │   │   ├── 📄 PartnerDetailPage.tsx
│   │   │   └── 📄 PartnersDashboard.tsx
│   │   ├── 📁 comptabilite
│   │   │   ├── 📄 ComptaComptesPages.tsx
│   │   │   ├── 📄 ComptaConfigPage.tsx
│   │   │   ├── 📄 ComptaDashboard.tsx
│   │   │   ├── 📄 ComptaEditionPage.tsx
│   │   │   ├── 📄 ComptaJournalPage.tsx
│   │   │   ├── 📄 ComptaParametresAvances.tsx
│   │   │   ├── 📄 ComptaPeriodPage.tsx
│   │   │   └── 📄 ComptaSaisiePage.tsx
│   │   ├── 📁 facturation
│   │   │   └── 📄 BillingDashboard.tsx
│   │   ├── 📁 finance
│   │   │   ├── 📄 FinBudgetPage.tsx
│   │   │   ├── 📄 FinConfigPage.tsx
│   │   │   ├── 📄 FinDashboard.tsx
│   │   │   ├── 📄 FinEngagementPage.tsx
│   │   │   └── 📄 FinTresoreriePage.tsx
│   │   ├── 📁 immobilisation
│   │   │   ├── 📄 ImmoDashboard.tsx
│   │   │   ├── 📄 ImmoListePage.tsx
│   │   │   ├── 📄 ImmoRapportPage.tsx
│   │   │   └── 📄 ImmoSaisiePage.tsx
│   │   ├── 📁 parametres
│   │   │   ├── 📁 administration
│   │   │   │   ├── 📄 EntityManagement.tsx
│   │   │   │   ├── 📄 RolePermissions.tsx
│   │   │   │   ├── 📄 SystemSettings.tsx
│   │   │   │   └── 📄 UserManagement.tsx
│   │   │   └── 📄 Settings.tsx
│   │   ├── 📁 products
│   │   │   └── 📄 ProductsDashboard.tsx
│   │   ├── 📁 provision_regulation
│   │   ├── 📁 ventes
│   │   │   └── 📄 SalesDashboard.tsx
│   │   └── 📄 Dashboard.tsx
│   ├── 📁 types
│   │   └── 📄 index.ts
│   ├── 🎨 App.css
│   ├── 📄 App.tsx
│   ├── 🎨 index.css
│   ├── 📄 main.tsx
│   └── 📄 vite-env.d.ts
├── ⚙️ .gitignore
├── 📝 arborescence.md
├── 📄 eslint.config.js
├── 🌐 index.html
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── 📄 postcss.config.js
├── 📄 tailwind.config.js
├── ⚙️ tsconfig.app.json
├── ⚙️ tsconfig.json
├── ⚙️ tsconfig.node.json
└── 📄 vite.config.ts
```

---
*Generated by FileTree Pro Extension*