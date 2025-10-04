# File Tree: compta_pro

Generated on: 10/1/2025, 2:10:46 AM
Root path: `c:\Users\user\OneDrive\Documents\compta_pro`

```
├── 📁 dist/ 🚫 (auto-hidden)
├── 📁 node_modules/ 🚫 (auto-hidden)
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 administration/
│   │   │   ├── 📄 EntityForm.tsx
│   │   │   ├── 📄 NumberSequenceConfig.tsx
│   │   │   ├── 📄 RoleMatrix.tsx
│   │   │   └── 📄 UserForm.tsx
│   │   ├── 📁 auth/
│   │   │   └── 📄 ProtectedRoute.tsx
│   │   ├── 📁 charts/
│   │   │   ├── 📄 BarChart.tsx
│   │   │   └── 📄 PieChart.tsx
│   │   ├── 📁 comptabilite/
│   │   │   ├── 📁 comptesPage/
│   │   │   │   ├── 📄 AccountHierarchy.tsx
│   │   │   │   ├── 📄 ComptaCreerCompte.tsx
│   │   │   │   ├── 📄 ComptaImporterComptes.tsx
│   │   │   │   ├── 📄 ComptaListeComptesTiers.tsx
│   │   │   │   ├── 📄 ComptaPlanComptable.tsx
│   │   │   │   ├── 📄 ComptaRechercheCompte.tsx
│   │   │   │   └── 📄 SYSCOHADAValidator.tsx
│   │   │   ├── 📁 configurationPage/
│   │   │   │   ├── 📄 ComptaAutorisations.tsx
│   │   │   │   ├── 📄 ComptaBalanceConfig.tsx
│   │   │   │   ├── 📄 ComptaClotureBalance.tsx
│   │   │   │   ├── 📄 ComptaConfigComptes.tsx
│   │   │   │   ├── 📄 ComptaConfigJournaux.tsx
│   │   │   │   └── 📄 ComptaParametresDossier.tsx
│   │   │   ├── 📁 editionPage/
│   │   │   │   ├── 📄 ComptaEditerEtatComptable.tsx
│   │   │   │   ├── 📄 ComptaEditerEtatFinancier.tsx
│   │   │   │   ├── 📄 ComptaRapportAnomalies.tsx
│   │   │   │   └── 📄 comptaLivreJournal.tsx
│   │   │   ├── 📁 journalPage/
│   │   │   │   ├── 📄 JournalClosing.tsx
│   │   │   │   ├── 📄 JournalConfiguration.tsx
│   │   │   │   ├── 📄 JournalCreation.tsx
│   │   │   │   └── 📄 JournalTypeSelector.tsx
│   │   │   ├── 📁 parametresAvancesPage/
│   │   │   │   ├── 📄 ComptaImportations.tsx
│   │   │   │   ├── 📄 ComptaRapprocheBancaire.tsx
│   │   │   │   └── 📄 ComptaRegenererPeriode.tsx
│   │   │   ├── 📁 periodePage/
│   │   │   │   ├── 📄 FiscalYearSetup.tsx
│   │   │   │   ├── 📄 PeriodClosing.tsx
│   │   │   │   ├── 📄 PeriodManagement.tsx
│   │   │   │   └── 📄 YearEndProcess.tsx
│   │   │   └── 📁 saisiePage/
│   │   │       ├── 📄 ApprovalWorkflow.tsx
│   │   │       ├── 📄 BatchProcessing.tsx
│   │   │       ├── 📄 ComptaAjoutPieceSuccessive.tsx
│   │   │       ├── 📄 ComptaOptionsMenuSuperieur.tsx
│   │   │       ├── 📄 ComptaSaisieActions.tsx
│   │   │       ├── 📄 ComptaSaisieCompletePiece.tsx
│   │   │       ├── 📄 ComptaSaisiePieceComptable.tsx
│   │   │       └── 📄 EntryValidation.tsx
│   │   ├── 📁 finance/
│   │   │   ├── 📁 budget/
│   │   │   │   ├── 📄 FinBudgetChart.tsx
│   │   │   │   └── 📄 FinCategorySelector.tsx
│   │   │   ├── 📁 engagement/
│   │   │   │   ├── 📄 FinEngagementForm.tsx
│   │   │   │   └── 📄 FinTypeBadge.tsx
│   │   │   └── 📁 tresorerie/
│   │   │       ├── 📄 BankReconciliation.tsx
│   │   │       ├── 📄 CashFlowForecast.tsx
│   │   │       ├── 📄 CashPositionMonitor.tsx
│   │   │       ├── 📄 FinAccountSelector.tsx
│   │   │       └── 📄 FinTransactionFlow.tsx
│   │   ├── 📁 immobilisation/
│   │   │   ├── 📄 ImmoAmortissementChart.tsx
│   │   │   ├── 📄 ImmoListTable.tsx
│   │   │   └── 📄 ImmoSaisieForm.tsx
│   │   ├── 📁 layout/
│   │   │   ├── 📄 Header.tsx
│   │   │   ├── 📄 Layout.tsx
│   │   │   └── 📄 Sidebar.tsx
│   │   └── 📁 ui/
│   │       └── 📄 Card.tsx
│   ├── 📁 hooks/
│   │   ├── 📁 administration/
│   │   │   ├── 📄 useEntityManagement.ts
│   │   │   ├── 📄 useSystemConfig.ts
│   │   │   └── 📄 useUserManagement.ts
│   │   ├── 📁 authentification/
│   │   │   └── 📄 useAuth.tsx
│   │   ├── 📁 clients_fournisseurs/
│   │   │   ├── 📁 clients/
│   │   │   └── 📁 fournisseurs/
│   │   ├── 📁 comptabilite/
│   │   │   ├── 📁 module_five/
│   │   │   │   ├── 📄 useApprovalWorkflow.ts
│   │   │   │   ├── 📄 useEntryValidation.ts
│   │   │   │   └── 📄 useTransactionProcessing.ts
│   │   │   ├── 📁 module_six/
│   │   │   │   ├── 📄 useFiscalYear.ts
│   │   │   │   └── 📄 usePeriodManagement.ts
│   │   │   └── 📁 module_three/
│   │   │       ├── 📄 useAccountValidation.ts
│   │   │       ├── 📄 useChartOfAccounts.ts
│   │   │       └── 📄 useSYSCOHADACompliance.ts
│   │   ├── 📁 facturation/
│   │   ├── 📁 finance/
│   │   │   └── 📁 module_height/
│   │   │       ├── 📄 useBankAccounts.ts
│   │   │       ├── 📄 useCashFlow.ts
│   │   │       └── 📄 useTreasuryManagement.ts
│   │   ├── 📁 immobilisattion/
│   │   ├── 📁 provision_regulation/
│   │   └── 📁 ventes/
│   ├── 📁 pages/
│   │   ├── 📁 authentification/
│   │   │   └── 📄 Login.tsx
│   │   ├── 📁 client_fournisseur/
│   │   │   ├── 📁 clients/
│   │   │   └── 📁 fournisseurs/
│   │   ├── 📁 comptabilite/
│   │   │   ├── 📄 ComptaComptesPages.tsx
│   │   │   ├── 📄 ComptaConfigPage.tsx
│   │   │   ├── 📄 ComptaDashboard.tsx
│   │   │   ├── 📄 ComptaEditionPage.tsx
│   │   │   ├── 📄 ComptaJournalPage.tsx
│   │   │   ├── 📄 ComptaParametresAvances.tsx
│   │   │   ├── 📄 ComptaPeriodPage.tsx
│   │   │   └── 📄 ComptaSaisiePage.tsx
│   │   ├── 📁 facturation/
│   │   ├── 📁 finance/
│   │   │   ├── 📄 FinBudgetPage.tsx
│   │   │   ├── 📄 FinConfigPage.tsx
│   │   │   ├── 📄 FinDashboard.tsx
│   │   │   ├── 📄 FinEngagementPage.tsx
│   │   │   └── 📄 FinTresoreriePage.tsx
│   │   ├── 📁 immobilisation/
│   │   │   ├── 📄 ImmoDashboard.tsx
│   │   │   ├── 📄 ImmoListePage.tsx
│   │   │   ├── 📄 ImmoRapportPage.tsx
│   │   │   └── 📄 ImmoSaisiePage.tsx
│   │   ├── 📁 parametres/
│   │   │   ├── 📁 administration/
│   │   │   │   ├── 📄 EntityManagement.tsx
│   │   │   │   ├── 📄 RolePermissions.tsx
│   │   │   │   ├── 📄 SystemSettings.tsx
│   │   │   │   └── 📄 UserManagement.tsx
│   │   │   └── 📄 Settings.tsx
│   │   ├── 📁 provision_regulation/
│   │   ├── 📁 ventes/
│   │   └── 📄 Dashboard.tsx
│   ├── 📁 types/
│   │   └── 📄 index.ts
│   ├── 🎨 App.css
│   ├── 📄 App.tsx
│   ├── 🎨 index.css
│   ├── 📄 main.tsx
│   └── 📄 vite-env.d.ts
├── 🚫 .gitignore
├── 📝 arborescence.md
├── 📄 eslint.config.js
├── 🌐 index.html
├── 📄 package-lock.json
├── 📄 package.json
├── 📄 postcss.config.js
├── 📄 tailwind.config.js
├── 📄 tsconfig.app.json
├── 📄 tsconfig.json
├── 📄 tsconfig.node.json
└── 📄 vite.config.ts
```

---
*Generated by FileTree Pro Extension*