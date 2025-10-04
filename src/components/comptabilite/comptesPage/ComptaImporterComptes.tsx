import React, { useState } from 'react';
import { 
  Card, 
  Upload, 
  Button, 
  Table, 
  Space, 
  Tag, 
  Alert, 
  Progress,
  Modal,
  Steps,
  Typography
} from 'antd';
import { 
  UploadOutlined, 
  FileExcelOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined 
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { ChartAccount } from '../../../types';
import { useChartOfAccounts } from '../../../hooks/comptabilite/module_three/useChartOfAccounts';
import { useAccountValidation } from '../../../hooks/comptabilite/module_three/useAccountValidation';

const { Title, Text } = Typography;
const { Step } = Steps;

interface ComptaImporterComptesProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ImportResult {
  valid: ChartAccount[];
  invalid: Array<{ data: any; errors: string[] }>;
  total: number;
}

const ComptaImporterComptes: React.FC<ComptaImporterComptesProps> = ({
  open,
  onClose,
  onSuccess
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const { createAccount } = useChartOfAccounts();
  const { validateAccount } = useAccountValidation();

  const downloadTemplate = () => {
    const template = [
      {
        'Code': '101',
        'Classe': '1',
        'Type': 'EQUITY',
        'Nom': 'Capital social',
        'Description': 'Capital social de l\'entreprise',
        'Auxiliaire': 'Non',
        'Rapprochable': 'Non',
        'Actif': 'Oui',
        'Parent': ''
      },
      {
        'Code': '411',
        'Classe': '4',
        'Type': 'ASSET', 
        'Nom': 'Clients',
        'Description': 'Compte clients',
        'Auxiliaire': 'Oui',
        'Rapprochable': 'Oui',
        'Actif': 'Oui',
        'Parent': '41'
      }
    ];

    // Simulation de téléchargement
    console.log('Template téléchargé:', template);
  };

  const processImportData = (data: any[]): ImportResult => {
    const valid: ChartAccount[] = [];
    const invalid: Array<{ data: any; errors: string[] }> = [];

    data.forEach((row, index) => {
      const errors: string[] = [];

      // Validation des champs requis
      if (!row.Code) errors.push('Code manquant');
      if (!row.Classe) errors.push('Classe manquante');
      if (!row.Type) errors.push('Type manquant');
      if (!row.Nom) errors.push('Nom manquant');

      if (errors.length > 0) {
        invalid.push({ data: row, errors });
        return;
      }

      // Création de l'objet compte
      const account: Omit<ChartAccount, 'id' | 'createdAt' | 'createdBy'> = {
        code: row.Code.toString(),
        name: row.Nom,
        class: row.Classe.toString() as any,
        type: row.Type as any,
        description: row.Description || '',
        isAuxiliary: row.Auxiliaire === 'Oui',
        isReconcilable: row.Rapprochable === 'Oui',
        isActive: row.Actif !== 'Non',
        parentId: row.Parent || undefined,
        level: row.Parent ? row.Parent.toString().length + 1 : 1,
        entity: 'default'
      };

      // Validation SYSCOHADA
      const validation = validateAccount(account as ChartAccount);
      if (!validation.isValid) {
        invalid.push({ data: row, errors: validation.errors });
        return;
      }

      valid.push(account as ChartAccount);
    });

    return {
      valid,
      invalid,
      total: data.length
    };
  };

  const handleUpload = (file: File) => {
    setImporting(true);
    setCurrentStep(1);

    // Simulation de traitement Excel
    setTimeout(() => {
      const simulatedData = [
        {
          'Code': '101',
          'Classe': '1',
          'Type': 'EQUITY',
          'Nom': 'Capital social',
          'Description': 'Capital social de l\'entreprise',
          'Auxiliaire': 'Non',
          'Rapprochable': 'Non',
          'Actif': 'Oui',
          'Parent': ''
        },
        {
          'Code': '411',
          'Classe': '4', 
          'Type': 'ASSET',
          'Nom': 'Clients',
          'Description': 'Compte clients',
          'Auxiliaire': 'Oui',
          'Rapprochable': 'Oui', 
          'Actif': 'Oui',
          'Parent': '41'
        },
        {
          'Code': '999',
          'Classe': '9',
          'Type': 'INVALID',
          'Nom': '',
          'Auxiliaire': 'Non',
          'Rapprochable': 'Non',
          'Actif': 'Oui'
        }
      ];

      const result = processImportData(simulatedData);
      setPreviewData(simulatedData);
      setImportResult(result);
      setImporting(false);
      setCurrentStep(2);
    }, 2000);

    return false;
  };

  const handleConfirmImport = async () => {
    if (!importResult) return;

    setImporting(true);
    setCurrentStep(3);

    try {
      // Créer les comptes valides
      for (const account of importResult.valid) {
        await createAccount(account);
      }

      setCurrentStep(4);
    } catch (error) {
      console.error('Erreur import:', error);
    } finally {
      setImporting(false);
    }
  };

  const resetImport = () => {
    setCurrentStep(0);
    setImportResult(null);
    setPreviewData([]);
    setImporting(false);
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
      title: 'Code',
      dataIndex: 'Code',
      key: 'Code'
    },
    {
      title: 'Classe',
      dataIndex: 'Classe', 
      key: 'Classe'
    },
    {
      title: 'Nom',
      dataIndex: 'Nom',
      key: 'Nom'
    },
    {
      title: 'Statut',
      key: 'status',
      render: (_, record, index) => {
        const isValid = importResult?.valid.some(acc => acc.code === record.Code) || 
                       !importResult?.invalid.some(inv => inv.data === record);
        return isValid ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>Valide</Tag>
        ) : (
          <Tag color="red" icon={<CloseCircleOutlined />}>Erreur</Tag>
        );
      }
    }
  ];

  return (
    <Modal
      title="Importation du Plan Comptable"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        <Step title="Fichier" description="Importer le fichier" />
        <Step title="Validation" description="Vérifier les données" />
        <Step title="Confirmation" description="Confirmer l'import" />
        <Step title="Importation" description="Créer les comptes" />
        <Step title="Terminé" description="Importation complète" />
      </Steps>

      {currentStep === 0 && (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Alert
            message="Format de fichier requis"
            description={
              <div>
                <div>Le fichier Excel doit contenir les colonnes suivantes:</div>
                <ul>
                  <li><strong>Code</strong> (obligatoire) - Code du compte (2-6 chiffres)</li>
                  <li><strong>Classe</strong> (obligatoire) - Classe comptable (1-9)</li>
                  <li><strong>Type</strong> (obligatoire) - ASSET, LIABILITY, EQUITY, INCOME, EXPENSE</li>
                  <li><strong>Nom</strong> (obligatoire) - Nom du compte</li>
                  <li><strong>Description</strong> (optionnel) - Description du compte</li>
                  <li><strong>Auxiliaire</strong> - Oui/Non</li>
                  <li><strong>Rapprochable</strong> - Oui/Non</li>
                  <li><strong>Actif</strong> - Oui/Non</li>
                  <li><strong>Parent</strong> (optionnel) - Code du compte parent</li>
                </ul>
              </div>
            }
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
            message={`Validation terminée - ${importResult.valid.length} valide(s), ${importResult.invalid.length} erreur(s)`}
            type={importResult.invalid.length === 0 ? "success" : "warning"}
            showIcon
          />

          <Progress 
            percent={Math.round((importResult.valid.length / importResult.total) * 100)} 
            status={importResult.invalid.length === 0 ? "success" : "normal"}
          />

          <Table
            columns={columns}
            dataSource={previewData}
            size="small"
            pagination={false}
            scroll={{ y: 300 }}
          />

          {importResult.invalid.length > 0 && (
            <div>
              <Title level={5}>Détails des erreurs:</Title>
              {importResult.invalid.map((item, index) => (
                <div key={index} style={{ marginBottom: 8, padding: 8, backgroundColor: '#fff2f0', borderRadius: 4 }}>
                  <Text type="danger">Ligne {previewData.findIndex(d => d === item.data) + 1}: </Text>
                  <Text>{item.errors.join(', ')}</Text>
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
              disabled={importResult.valid.length === 0}
            >
              Importer {importResult.valid.length} compte(s)
            </Button>
          </Space>
        </Space>
      )}

      {currentStep === 2 && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Progress type="circle" percent={100} status="active" />
          <div style={{ marginTop: 16 }}>
            <Title level={4}>Confirmation de l'import</Title>
            <Text>Prêt à importer {importResult?.valid.length} compte(s)</Text>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <Alert
          message="Importation en cours"
          description="Création des comptes dans le système..."
          type="info"
          showIcon
        />
      )}

      {currentStep === 4 && (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Alert
            message="Importation terminée avec succès"
            description={`${importResult?.valid.length} comptes ont été créés avec succès`}
            type="success"
            showIcon
          />
          <Button 
            type="primary" 
            onClick={() => {
              onSuccess();
              onClose();
              resetImport();
            }}
          >
            Terminer
          </Button>
        </Space>
      )}
    </Modal>
  );
};

export default ComptaImporterComptes;