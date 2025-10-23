import React, { useState } from 'react';
import { Card, Row, Col, Button, Upload, Alert, Progress, Table, Tag, Modal, Form, Select, Switch, Steps } from 'antd';
import { motion } from 'framer-motion';
import { 
  UploadOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { useDataImport } from '../../../hooks/comptabilite/module_three/useDataImport';
import { ImportResult, ImportOptions } from '../../../types';

const { Dragger } = Upload;
const { Option } = Select;

export const ComptaImportations: React.FC = () => {
  const [importType, setImportType] = useState<'accounts' | 'entries'>('accounts');
  const [importResults, setImportResults] = useState<ImportResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const {
    loading,
    error,
    importProgress,
    importChartOfAccounts,
    importJournalEntries,
    validateImportFile,
    generateImportTemplate
  } = useDataImport();

  const [form] = Form.useForm();

  const handleFileUpload = async (file: File) => {
    setCurrentStep(1); // Validation
    
    try {
      // Valider le fichier
      const validation = await validateImportFile(file);
      if (!validation.isValid) {
        Alert.error('Fichier invalide');
        return false;
      }

      setCurrentStep(2); // Traitement
      
      const options: ImportOptions = {
        overwriteExisting: form.getFieldValue('overwriteExisting') || false,
        createMissingAccounts: form.getFieldValue('createMissingAccounts') || false,
        validateSYSCOHADA: form.getFieldValue('validateSYSCOHADA') || true,
        autoActivateAccounts: form.getFieldValue('autoActivateAccounts') || false
      };

      let results: ImportResult;
      if (importType === 'accounts') {
        results = await importChartOfAccounts(file, options);
      } else {
        results = await importJournalEntries(file, 'period-2024-06', 'journal-1');
      }

      setImportResults(results);
      setCurrentStep(3); // Résultats
      setShowResults(true);
      
    } catch (err) {
      console.error('Erreur importation:', err);
    }
    
    return false; // Empêcher l'upload automatique
  };

  const handleDownloadTemplate = async () => {
    try {
      const template = await generateImportTemplate(importType);
      const blob = new Blob([template], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `template-${importType}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur téléchargement template:', err);
    }
  };

  const steps = [
    { title: 'Sélection', description: 'Type et options' },
    { title: 'Validation', description: 'Vérification du fichier' },
    { title: 'Traitement', description: 'Importation des données' },
    { title: 'Résultats', description: 'Récapitulatif' }
  ];

  const resultColumns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'error' ? 'red' : type === 'warning' ? 'orange' : 'blue'}>
          {type === 'error' ? 'Erreur' : type === 'warning' ? 'Avertissement' : 'Info'}
        </Tag>
      )
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message'
    }
  ];

  const resultData = importResults ? [
    ...importResults.errors.map((error, index) => ({
      key: `error-${index}`,
      type: 'error',
      message: error
    })),
    ...importResults.warnings.map((warning, index) => ({
      key: `warning-${index}`,
      type: 'warning',
      message: warning
    }))
  ] : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UploadOutlined />
            Importation de Données Comptables
          </div>
        }
        extra={
          <Button 
            icon={<DownloadOutlined />}
            onClick={handleDownloadTemplate}
          >
            Télécharger Template
          </Button>
        }
      >
        {error && (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />
        )}

        <Steps current={currentStep} items={steps} style={{ marginBottom: 24 }} />

        <Row gutter={24}>
          {/* Colonne de configuration */}
          <Col span={8}>
            <Card title="Configuration de l'Importation" size="small">
              <Form
                form={form}
                layout="vertical"
                initialValues={{
                  importType: 'accounts',
                  validateSYSCOHADA: true,
                  createMissingAccounts: true,
                  overwriteExisting: false,
                  autoActivateAccounts: false
                }}
              >
                <Form.Item name="importType" label="Type d'Importation">
                  <Select onChange={setImportType}>
                    <Option value="accounts">Plan Comptable</Option>
                    <Option value="entries">Écritures Comptables</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="validateSYSCOHADA"
                  valuePropName="checked"
                  label=" "
                >
                  <Switch />
                  <span style={{ marginLeft: 8 }}>Validation SYSCOHADA</span>
                </Form.Item>

                <Form.Item
                  name="createMissingAccounts"
                  valuePropName="checked"
                  label=" "
                >
                  <Switch />
                  <span style={{ marginLeft: 8 }}>Créer comptes manquants</span>
                </Form.Item>

                <Form.Item
                  name="overwriteExisting"
                  valuePropName="checked"
                  label=" "
                >
                  <Switch />
                  <span style={{ marginLeft: 8 }}>Écraser données existantes</span>
                </Form.Item>

                <Form.Item
                  name="autoActivateAccounts"
                  valuePropName="checked"
                  label=" "
                >
                  <Switch />
                  <span style={{ marginLeft: 8 }}>Activer comptes automatiquement</span>
                </Form.Item>
              </Form>
            </Card>

            {/* Informations sur le format */}
            <Card title="Format Requis" size="small" style={{ marginTop: 16 }}>
              {importType === 'accounts' ? (
                <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
                  <div><strong>CSV/Excel avec colonnes:</strong></div>
                  <div>• Code (6 chiffres)</div>
                  <div>• Nom (texte)</div>
                  <div>• Classe (1-9)</div>
                  <div>• Type (ASSET/LIABILITY/etc.)</div>
                  <div>• Auxiliaire (true/false)</div>
                  <div>• Rapprochable (true/false)</div>
                </div>
              ) : (
                <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
                  <div><strong>CSV/Excel avec colonnes:</strong></div>
                  <div>• Date (AAAA-MM-JJ)</div>
                  <div>• Compte (code)</div>
                  <div>• Libellé (texte)</div>
                  <div>• Débit (nombre)</div>
                  <div>• Crédit (nombre)</div>
                  <div>• Journal (code)</div>
                </div>
              )}
            </Card>
          </Col>

          {/* Colonne d'upload */}
          <Col span={16}>
            <Card title="Importation du Fichier" size="small">
              <Dragger
                name="file"
                multiple={false}
                accept={importType === 'accounts' ? '.csv,.xlsx,.xls' : '.csv,.xlsx,.xls'}
                beforeUpload={handleFileUpload}
                showUploadList={false}
                disabled={loading}
              >
                <div style={{ padding: '40px 0', textAlign: 'center' }}>
                  {loading ? (
                    <>
                      <Progress 
                        type="circle" 
                        percent={importProgress} 
                        style={{ marginBottom: 16 }}
                      />
                      <div style={{ fontWeight: 'bold' }}>
                        Importation en cours...
                      </div>
                      <div style={{ color: '#666', fontSize: '12px' }}>
                        Ne pas fermer cette page
                      </div>
                    </>
                  ) : (
                    <>
                      <FileExcelOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: 16 }} />
                      <div style={{ fontWeight: 'bold' }}>
                        Cliquez ou glissez-déposez le fichier
                      </div>
                      <div style={{ color: '#666', fontSize: '12px' }}>
                        Supporte CSV et Excel
                      </div>
                    </>
                  )}
                </div>
              </Dragger>

              {/* Progression linéaire */}
              {loading && (
                <div style={{ marginTop: 16 }}>
                  <Progress percent={importProgress} status="active" />
                </div>
              )}
            </Card>

            {/* Statistiques rapides */}
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={8}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                    <div style={{ fontWeight: 'bold', marginTop: 8 }}>
                      {importType === 'accounts' ? 'Comptes' : 'Écritures'}
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                    <div style={{ fontWeight: 'bold', marginTop: 8 }}>
                      Validation Auto
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <WarningOutlined style={{ fontSize: '24px', color: '#faad14' }} />
                    <div style={{ fontWeight: 'bold', marginTop: 8 }}>
                      Logs Détaillés
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Modal des résultats */}
        <Modal
          title="Résultats de l'Importation"
          open={showResults}
          onCancel={() => setShowResults(false)}
          footer={[
            <Button key="close" onClick={() => setShowResults(false)}>
              Fermer
            </Button>
          ]}
          width={800}
        >
          {importResults && (
            <div>
              <Alert
                message={
                  importResults.success ? 
                  'Importation réussie' : 
                  'Importation avec erreurs'
                }
                type={importResults.success ? 'success' : 'warning'}
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="Enregistrements importés"
                      value={importResults.importedCount}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="Erreurs"
                      value={importResults.errors.length}
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="Avertissements"
                      value={importResults.warnings.length}
                      valueStyle={{ color: '#faad14' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="Doublons ignorés"
                      value={importResults.duplicates}
                      valueStyle={{ color: '#722ed1' }}
                    />
                  </Card>
                </Col>
              </Row>

              {resultData.length > 0 && (
                <Card title="Détails des Résultats" size="small">
                  <Table
                    columns={resultColumns}
                    dataSource={resultData}
                    pagination={false}
                    size="small"
                    scroll={{ y: 200 }}
                  />
                </Card>
              )}

              {importResults.success && (
                <div style={{ marginTop: 16, padding: '12px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  L'importation a été effectuée avec succès. Les données sont maintenant disponibles dans le système.
                </div>
              )}
            </div>
          )}
        </Modal>
      </Card>
    </motion.div>
  );
};

export default ComptaImportations;