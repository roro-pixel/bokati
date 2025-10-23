import React, { useState } from 'react';
import { Card, Row, Col, Button, Alert, Progress, Table, Tag, Modal, Form, Select, Switch, Steps, Timeline, Statistic } from 'antd';
import { motion } from 'framer-motion';
import { 
  ReloadOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  FileSearchOutlined
} from '@ant-design/icons';
import { usePeriodRegeneration } from '../../../hooks/comptabilite/module_six/usePeriodRegeneration';
import { RegenerationOptions, RegenerationResult } from '../../../types';

const { Option } = Select;

export const ComptaRegenererPeriode: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('period-2024-06');
  const [regenerationInProgress, setRegenerationInProgress] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [regenerationResults, setRegenerationResults] = useState<RegenerationResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  
  const {
    loading,
    error,
    progress,
    regeneratePeriodBalances,
    checkDataIntegrity,
    regenerateAdjustmentEntries,
    forceClosePeriod,
    cancelRegeneration
  } = usePeriodRegeneration();

  const [form] = Form.useForm();

  const handleStartRegeneration = async (values: any) => {
    setRegenerationInProgress(true);
    setCurrentStep(1);

    try {
      const options: RegenerationOptions = {
        recalculateBalances: values.recalculateBalances || true,
        regenerateJournals: values.regenerateJournals || false,
        updateReports: values.updateReports || true,
        forceRecalculation: values.forceRecalculation || false,
        includeAuxiliary: values.includeAuxiliary || true
      };

      // Vérification d'intégrité d'abord
      setCurrentStep(2);
      const integrityCheck = await checkDataIntegrity(selectedPeriod);
      
      if (!integrityCheck.isValid && !options.forceRecalculation) {
        Alert.warning('Problèmes d\'intégrité détectés. Activez "Forcer le recalcul" pour continuer.');
        setRegenerationInProgress(false);
        return;
      }

      // Régénération des soldes
      setCurrentStep(3);
      const results = await regeneratePeriodBalances(selectedPeriod, options);
      setRegenerationResults(results);

      // Régénération des écritures de régularisation si demandé
      if (values.regenerateJournals) {
        setCurrentStep(4);
        await regenerateAdjustmentEntries(selectedPeriod);
      }

      setCurrentStep(5);
      setShowResults(true);
      
    } catch (err) {
      console.error('Erreur régénération:', err);
      setCurrentStep(0);
    } finally {
      setRegenerationInProgress(false);
    }
  };

  const steps = [
    { title: 'Configuration', description: 'Options de régénération' },
    { title: 'Vérification', description: 'Contrôle d\'intégrité' },
    { title: 'Soldes', description: 'Recalcul des soldes' },
    { title: 'Journaux', description: 'Régénération des journaux' },
    { title: 'Terminé', description: 'Processus achevé' }
  ];

  const periodOptions = [
    { id: 'period-2024-06', name: 'Juin 2024', status: 'OPEN' },
    { id: 'period-2024-05', name: 'Mai 2024', status: 'CLOSED' },
    { id: 'period-2024-04', name: 'Avril 2024', status: 'CLOSED' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ReloadOutlined />
            Régénération de Période Comptable
          </div>
        }
        extra={
          <Button 
            icon={<FileSearchOutlined />}
            onClick={() => checkDataIntegrity(selectedPeriod)}
            loading={loading}
          >
            Vérifier Intégrité
          </Button>
        }
      >
        {error && (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />
        )}

        <Alert
          message="Attention: Opération critique"
          description="La régénération d'une période peut modifier des données comptables existantes. Effectuez une sauvegarde avant de continuer."
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Steps current={currentStep} items={steps} style={{ marginBottom: 24 }} />

        <Row gutter={24}>
          {/* Colonne de configuration */}
          <Col span={8}>
            <Card title="Configuration" size="small">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleStartRegeneration}
                initialValues={{
                  period: 'period-2024-06',
                  recalculateBalances: true,
                  regenerateJournals: false,
                  updateReports: true,
                  forceRecalculation: false,
                  includeAuxiliary: true
                }}
              >
                <Form.Item name="period" label="Période à Régénérer">
                  <Select onChange={setSelectedPeriod}>
                    {periodOptions.map(period => (
                      <Option key={period.id} value={period.id}>
                        {period.name} 
                        <Tag color={period.status === 'OPEN' ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                          {period.status === 'OPEN' ? 'Ouverte' : 'Clôturée'}
                        </Tag>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="recalculateBalances"
                  valuePropName="checked"
                  label=" "
                >
                  <Switch />
                  <span style={{ marginLeft: 8, fontWeight: 'bold' }}>Recalculer les soldes</span>
                </Form.Item>

                <Form.Item
                  name="regenerateJournals"
                  valuePropName="checked"
                  label=" "
                >
                  <Switch />
                  <span style={{ marginLeft: 8, fontWeight: 'bold' }}>Régénérer les journaux</span>
                </Form.Item>

                <Form.Item
                  name="updateReports"
                  valuePropName="checked"
                  label=" "
                >
                  <Switch />
                  <span style={{ marginLeft: 8, fontWeight: 'bold' }}>Mettre à jour les rapports</span>
                </Form.Item>

                <Form.Item
                  name="forceRecalculation"
                  valuePropName="checked"
                  label=" "
                >
                  <Switch />
                  <span style={{ marginLeft: 8, fontWeight: 'bold' }}>Forcer le recalcul</span>
                </Form.Item>

                <Form.Item
                  name="includeAuxiliary"
                  valuePropName="checked"
                  label=" "
                >
                  <Switch />
                  <span style={{ marginLeft: 8, fontWeight: 'bold' }}>Inclure comptes auxiliaires</span>
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    icon={<PlayCircleOutlined />}
                    loading={regenerationInProgress}
                    style={{ width: '100%' }}
                    danger
                  >
                    Démarrer la Régénération
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            {/* Progression */}
            {regenerationInProgress && (
              <Card title="Progression" size="small" style={{ marginTop: 16 }}>
                <Progress 
                  percent={progress} 
                  status={progress === 100 ? 'success' : 'active'}
                  style={{ marginBottom: 8 }}
                />
                <div style={{ textAlign: 'center', color: '#666', fontSize: '12px' }}>
                  {steps[currentStep]?.description}
                </div>
              </Card>
            )}
          </Col>

          {/* Colonne d'informations */}
          <Col span={16}>
            <Card title="Informations de Régénération" size="small">
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={8}>
                  <Statistic
                    title="Période Sélectionnée"
                    value={periodOptions.find(p => p.id === selectedPeriod)?.name || 'N/A'}
                    prefix={<CalendarOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Statut"
                    value={periodOptions.find(p => p.id === selectedPeriod)?.status === 'OPEN' ? 'Ouverte' : 'Clôturée'}
                    valueStyle={{ 
                      color: periodOptions.find(p => p.id === selectedPeriod)?.status === 'OPEN' ? '#52c41a' : '#ff4d4f' 
                    }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Opérations"
                    value="5"
                    suffix="étapes"
                  />
                </Col>
              </Row>

              <Timeline>
                <Timeline.Item dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}>
                  <div style={{ fontWeight: 'bold' }}>Vérification des données</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    Contrôle de l'intégrité des données comptables
                  </div>
                </Timeline.Item>
                <Timeline.Item dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}>
                  <div style={{ fontWeight: 'bold' }}>Recalcul des soldes</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    Mise à jour des soldes de tous les comptes
                  </div>
                </Timeline.Item>
                <Timeline.Item dot={<WarningOutlined style={{ color: '#faad14' }} />}>
                  <div style={{ fontWeight: 'bold' }}>Régénération des journaux</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    Recréation des totaux de journaux (optionnel)
                  </div>
                </Timeline.Item>
                <Timeline.Item dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}>
                  <div style={{ fontWeight: 'bold' }}>Mise à jour des rapports</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    Régénération des balances et états financiers
                  </div>
                </Timeline.Item>
                <Timeline.Item dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}>
                  <div style={{ fontWeight: 'bold' }}>Validation finale</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    Vérification de la cohérence des données
                  </div>
                </Timeline.Item>
              </Timeline>
            </Card>

            {/* Avertissements */}
            <Card title="Considérations Importantes" size="small" style={{ marginTop: 16 }}>
              <Alert
                message="Impact sur les données"
                description="Cette opération modifie les soldes comptables et peut affecter les rapports déjà générés."
                type="warning"
                showIcon
                style={{ marginBottom: 8 }}
              />
              <Alert
                message="Temps d'exécution"
                description="Le processus peut prendre plusieurs minutes selon le volume de données."
                type="info"
                showIcon
                style={{ marginBottom: 8 }}
              />
              <Alert
                message="Sauvegarde recommandée"
                description="Effectuez une sauvegarde de la base de données avant de procéder."
                type="error"
                showIcon
              />
            </Card>
          </Col>
        </Row>

        {/* Modal des résultats */}
        <Modal
          title="Résultats de la Régénération"
          open={showResults}
          onCancel={() => setShowResults(false)}
          footer={[
            <Button key="close" type="primary" onClick={() => setShowResults(false)}>
              Fermer
            </Button>
          ]}
          width={700}
        >
          {regenerationResults && (
            <div>
              <Alert
                message={
                  regenerationResults.success ? 
                  'Régénération terminée avec succès' : 
                  'Régénération avec des erreurs'
                }
                type={regenerationResults.success ? 'success' : 'warning'}
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="Traités"
                      value={regenerationResults.processed}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="Durée"
                      value={regenerationResults.duration}
                      suffix="secondes"
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="Erreurs"
                      value={regenerationResults.errors.length}
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="Avertissements"
                      value={regenerationResults.warnings.length}
                      valueStyle={{ color: '#faad14' }}
                    />
                  </Card>
                </Col>
              </Row>

              {regenerationResults.errors.length > 0 && (
                <Card title="Erreurs Rencontrées" size="small" style={{ marginBottom: 16 }}>
                  <ul>
                    {regenerationResults.errors.map((error, index) => (
                      <li key={index} style={{ color: '#ff4d4f' }}>
                        <CloseCircleOutlined style={{ marginRight: 8 }} />
                        {error}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {regenerationResults.warnings.length > 0 && (
                <Card title="Avertissements" size="small" style={{ marginBottom: 16 }}>
                  <ul>
                    {regenerationResults.warnings.map((warning, index) => (
                      <li key={index} style={{ color: '#faad14' }}>
                        <WarningOutlined style={{ marginRight: 8 }} />
                        {warning}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              <Card title="Détails du Traitement" size="small">
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="Comptes traités">
                    {regenerationResults.details.accounts}
                  </Descriptions.Item>
                  <Descriptions.Item label="Journaux régénérés">
                    {regenerationResults.details.journals}
                  </Descriptions.Item>
                  <Descriptions.Item label="Écritures traitées">
                    {regenerationResults.details.entries}
                  </Descriptions.Item>
                  <Descriptions.Item label="Soldes recalculés">
                    {regenerationResults.details.balances}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </div>
          )}
        </Modal>
      </Card>
    </motion.div>
  );
};

export default ComptaRegenererPeriode;