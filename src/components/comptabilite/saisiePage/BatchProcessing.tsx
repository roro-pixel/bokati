// src/components/comptabilite/saisiePage/BatchProcessing.tsx
import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Upload, 
  Table, 
  Space, 
  Tag, 
  Progress, 
  Modal, 
  Alert,
  Typography,
  Steps 
} from 'antd';
import { 
  UploadOutlined, 
  FileExcelOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined 
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { JournalEntry, JournalEntryLine } from '../../../types';

const { Title, Text } = Typography;
const { Step } = Steps;

interface BatchProcessingProps {
  onEntriesImport: (entries: JournalEntry[]) => void;
}

interface ImportResult {
  success: number;
  errors: number;
  total: number;
  errorDetails: Array<{
    row: number;
    errors: string[];
  }>;
}

const BatchProcessing: React.FC<BatchProcessingProps> = ({ onEntriesImport }) => {
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Template pour le fichier Excel
  const downloadTemplate = () => {
    const template = [
      {
        'Journal': 'GEN',
        'Date Écriture': '15/01/2024',
        'Date Comptable': '15/01/2024',
        'Description': 'Exemple d\'écriture',
        'Référence': 'FAC-2024-001',
        'Compte Débit': '512000',
        'Montant Débit': '100000',
        'Description Débit': 'Paiement client',
        'Compte Crédit': '701000',
        'Montant Crédit': '100000',
        'Description Crédit': 'Vente de marchandises'
      }
    ];

    // Simulation de téléchargement
    message.info('Template téléchargé (simulation)');
  };

  const processExcelData = (data: any[]): { entries: JournalEntry[], errors: any[] } => {
    const entries: JournalEntry[] = [];
    const errors: Array<{ row: number; errors: string[] }> = [];

    data.forEach((row, index) => {
      const rowErrors: string[] = [];

      // Validation des données
      if (!row.Journal) rowErrors.push('Journal manquant');
      if (!row['Date Écriture']) rowErrors.push('Date d\'écriture manquante');
      if (!row['Compte Débit'] && !row['Compte Crédit']) rowErrors.push('Aucun compte spécifié');
      
      const debitAmount = parseFloat(row['Montant Débit']) || 0;
      const creditAmount = parseFloat(row['Montant Crédit']) || 0;
      
      if (Math.abs(debitAmount - creditAmount) > 0.01) {
        rowErrors.push('Écriture déséquilibrée');
      }

      if (rowErrors.length > 0) {
        errors.push({ row: index + 2, errors: rowErrors }); // +2 pour header et index 0-based
        return;
      }

      // Construction des lignes d'écriture
      const lines: JournalEntryLine[] = [];

      if (debitAmount > 0) {
        lines.push({
          id: `temp-debit-${index}`,
          entryId: 'temp',
          accountId: row['Compte Débit'],
          type: 'DEBIT',
          amount: debitAmount,
          description: row['Description Débit'] || row.Description,
          createdAt: new Date()
        });
      }

      if (creditAmount > 0) {
        lines.push({
          id: `temp-credit-${index}`,
          entryId: 'temp',
          accountId: row['Compte Crédit'],
          type: 'CREDIT',
          amount: creditAmount,
          description: row['Description Crédit'] || row.Description,
          createdAt: new Date()
        });
      }

      const entry: JournalEntry = {
        id: `temp-entry-${index}`,
        entryNumber: `BATCH-${Date.now()}-${index}`,
        journalId: row.Journal,
        entity: 'current-entity',
        entryDate: new Date(row['Date Écriture']),
        accountingDate: new Date(row['Date Comptable'] || row['Date Écriture']),
        description: row.Description,
        referenceDocument: row.Référence,
        status: 'DRAFT',
        totalDebit: debitAmount,
        totalCredit: creditAmount,
        lines,
        submittedBy: 'batch-import',
        createdAt: new Date(),
        createdBy: 'batch-import'
      };

      entries.push(entry);
    });

    return { entries, errors };
  };

  const handleUpload = (file: File) => {
    setImporting(true);
    setCurrentStep(1);

    // Simulation de lecture Excel
    setTimeout(() => {
      // Données simulées pour la démo
      const simulatedData = [
        {
          'Journal': 'GEN',
          'Date Écriture': '15/01/2024',
          'Date Comptable': '15/01/2024',
          'Description': 'Vente au client ABC',
          'Référence': 'FAC-2024-001',
          'Compte Débit': '512000',
          'Montant Débit': '150000',
          'Description Débit': 'Paiement par virement',
          'Compte Crédit': '701000',
          'Montant Crédit': '150000',
          'Description Crédit': 'Vente de marchandises'
        },
        {
          'Journal': 'ACH',
          'Date Écriture': '16/01/2024',
          'Description': 'Achat fournitures',
          'Compte Débit': '602000',
          'Montant Débit': '50000',
          'Compte Crédit': '401000',
          'Montant Crédit': '50000'
        }
      ];

      const { entries, errors } = processExcelData(simulatedData);
      
      setPreviewData(simulatedData);
      setImportResult({
        success: entries.length,
        errors: errors.length,
        total: simulatedData.length,
        errorDetails: errors
      });
      
      setCurrentStep(2);
      setImporting(false);
    }, 2000);

    return false; // Empêcher l'upload automatique
  };

  const handleConfirmImport = () => {
    if (!importResult) return;

    const { entries } = processExcelData(previewData);
    onEntriesImport(entries);
    
    setCurrentStep(3);
    message.success(`${entries.length} écritures importées avec succès`);
  };

  const resetImport = () => {
    setImporting(false);
    setImportResult(null);
    setPreviewData([]);
    setCurrentStep(0);
  };

  const uploadProps: UploadProps = {
    beforeUpload: handleUpload,
    accept: '.xlsx, .xls, .csv',
    showUploadList: false
  };

  const columns = [
    {
      title: 'Ligne',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => index + 1
    },
    {
      title: 'Journal',
      dataIndex: 'Journal',
      key: 'Journal'
    },
    {
      title: 'Description',
      dataIndex: 'Description',
      key: 'Description',
      ellipsis: true
    },
    {
      title: 'Débit',
      dataIndex: 'Montant Débit',
      key: 'debit',
      render: (amount) => amount ? `${parseFloat(amount).toLocaleString()} FCFA` : '-'
    },
    {
      title: 'Crédit',
      dataIndex: 'Montant Crédit',
      key: 'credit',
      render: (amount) => amount ? `${parseFloat(amount).toLocaleString()} FCFA` : '-'
    },
    {
      title: 'Statut',
      key: 'status',
      render: (_, record, index) => {
        const hasError = importResult?.errorDetails.some(error => error.row === index + 2);
        return hasError ? (
          <Tag color="red" icon={<CloseCircleOutlined />}>Erreur</Tag>
        ) : (
          <Tag color="green" icon={<CheckCircleOutlined />}>Valide</Tag>
        );
      }
    }
  ];

  return (
    <Card title="Importation par Lot" style={{ marginBottom: 16 }}>
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        <Step title="Téléversement" description="Importer le fichier" />
        <Step title="Validation" description="Vérifier les données" />
        <Step title="Importation" description="Créer les écritures" />
        <Step title="Terminé" description="Importation complète" />
      </Steps>

      {currentStep === 0 && (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Alert
            message="Format de fichier requis"
            description="Le fichier Excel doit contenir les colonnes: Journal, Date Écriture, Description, Compte Débit, Montant Débit, Compte Crédit, Montant Crédit"
            type="info"
            showIcon
          />
          
          <Space>
            <Upload {...uploadProps}>
              <Button 
                icon={<UploadOutlined />} 
                loading={importing}
                type="primary"
              >
                Importer un fichier Excel
              </Button>
            </Upload>
            
            <Button 
              icon={<DownloadOutlined />} 
              onClick={downloadTemplate}
            >
              Télécharger le template
            </Button>
          </Space>
        </Space>
      )}

      {currentStep === 1 && importResult && (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Alert
            message={`Validation terminée - ${importResult.success} valide(s), ${importResult.errors} erreur(s)`}
            type={importResult.errors === 0 ? "success" : "warning"}
            showIcon
          />

          <Progress 
            percent={Math.round((importResult.success / importResult.total) * 100)} 
            status={importResult.errors === 0 ? "success" : "normal"}
          />

          <Table
            columns={columns}
            dataSource={previewData}
            size="small"
            pagination={false}
            scroll={{ y: 300 }}
          />

          {importResult.errorDetails.length > 0 && (
            <div>
              <Title level={5}>Détails des erreurs:</Title>
              {importResult.errorDetails.map((error, index) => (
                <div key={index} style={{ marginBottom: 8 }}>
                  <Text type="danger">Ligne {error.row}: </Text>
                  <Text>{error.errors.join(', ')}</Text>
                </div>
              ))}
            </div>
          )}

          <Space>
            <Button onClick={resetImport}>
              Annuler
            </Button>
            <Button 
              type="primary" 
              onClick={handleConfirmImport}
              disabled={importResult.success === 0}
            >
              Importer {importResult.success} écriture(s)
            </Button>
          </Space>
        </Space>
      )}

      {currentStep === 2 && (
        <Alert
          message="Importation en cours"
          description="Création des écritures dans le système..."
          type="info"
          showIcon
        />
      )}

      {currentStep === 3 && (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Alert
            message="Importation terminée avec succès"
            description={`${importResult?.success} écritures ont été créées avec succès`}
            type="success"
            showIcon
          />
          <Button onClick={resetImport}>
            Nouvelle importation
          </Button>
        </Space>
      )}
    </Card>
  );
};

export default BatchProcessing;