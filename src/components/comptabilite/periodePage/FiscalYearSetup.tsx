import React, { useState } from 'react';
import { Card, Row, Col, Form, Input, DatePicker, Button, Alert, Table, Tag, Statistic, Switch, Modal, Steps } from 'antd';
import { motion } from 'framer-motion';
import { 
  PlusOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  PlayCircleOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { useFiscalYear, FiscalYearSetup } from '../../../hooks/comptabilite/module_six/useFiscalYear';
import { usePeriodManagement } from '../../../hooks/comptabilite/module_six/usePeriodManagement';

const { RangePicker } = DatePicker;

export const FiscalYear: React.FC = () => {
  const [form] = Form.useForm();
  const [setupModalVisible, setSetupModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedPeriods, setGeneratedPeriods] = useState<any[]>([]);
  
  const { loading, error, validateFiscalYear, generatePeriods, calculateOpeningBalances } = useFiscalYear();
  const { fiscalYears, createFiscalYear, loading: periodLoading } = usePeriodManagement();

  const handleSetupFiscalYear = async (values: any) => {
    const setup: FiscalYearSetup = {
      year: values.year,
      startDate: values.dateRange[0],
      endDate: values.dateRange[1],
      copyFromPrevious: values.copyFromPrevious || false,
      includeOpeningBalances: values.includeOpeningBalances || false
    };

    // Validation
    const validation = validateFiscalYear(setup);
    if (!validation.isValid) {
      Alert.error(`Erreurs de validation: ${validation.errors.join(', ')}`);
      return;
    }

    // Générer les périodes
    const periods = generatePeriods(setup);
    setGeneratedPeriods(periods);
    setCurrentStep(1);

    // Si demandé, calculer les soldes d'ouverture
    if (setup.includeOpeningBalances && setup.copyFromPrevious) {
      setCurrentStep(2);
      try {
        await calculateOpeningBalances('fy-2023'); // ID de l'exercice précédent
      } catch (err) {
        console.error('Erreur calcul soldes:', err);
      }
    }
  };

  const handleCreateFiscalYear = async () => {
    const values = form.getFieldsValue();
    const setup: FiscalYearSetup = {
      year: values.year,
      startDate: values.dateRange[0],
      endDate: values.dateRange[1],
      copyFromPrevious: values.copyFromPrevious || false,
      includeOpeningBalances: values.includeOpeningBalances || false
    };

    try {
      await createFiscalYear({
        year: setup.year,
        startDate: setup.startDate,
        endDate: setup.endDate,
        entity: 'default'
      });

      Alert.success(`Exercice ${setup.year} créé avec succès!`);
      setSetupModalVisible(false);
      setCurrentStep(0);
      form.resetFields();
    } catch (err) {
      Alert.error('Erreur lors de la création de l\'exercice');
    }
  };

  const steps = [
    {
      title: 'Configuration',
      description: 'Définir les paramètres de l\'exercice'
    },
    {
      title: 'Périodes',
      description: 'Vérifier les périodes générées'
    },
    {
      title: 'Soldes',
      description: 'Calculer les soldes d\'ouverture'
    },
    {
      title: 'Finalisation',
      description: 'Créer l\'exercice'
    }
  ];

  const columns = [
    {
      title: 'Période',
      dataIndex: 'number',
      key: 'number',
      width: 80,
      render: (number: number) => (
        <Tag color={number === 13 ? 'orange' : 'blue'}>
          {number === 13 ? 'AJ' : `M${number}`}
        </Tag>
      )
    },
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Début',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: Date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Fin',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: Date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Type',
      dataIndex: 'isAdjustment',
      key: 'isAdjustment',
      render: (isAdjustment: boolean) => (
        <Tag color={isAdjustment ? 'orange' : 'green'}>
          {isAdjustment ? 'Ajustement' : 'Mensuelle'}
        </Tag>
      )
    }
  ];

  const activeFiscalYear = fiscalYears.find(fy => !fy.isClosed);
  const closedFiscalYears = fiscalYears.filter(fy => fy.isClosed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CalendarOutlined />
            Configuration des Exercices Comptables
          </div>
        }
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setSetupModalVisible(true)}
          >
            Nouvel Exercice
          </Button>
        }
      >
        {error && (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />
        )}

        {/* Statistiques */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Exercice Actuel"
                value={activeFiscalYear?.year || 'Aucun'}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Exercices Clôturés"
                value={closedFiscalYears.length}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Prochain Exercice"
                value={(parseInt(activeFiscalYear?.year || '2023') + 1).toString()}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Statut"
                value={activeFiscalYear ? 'Actif' : 'À configurer'}
                valueStyle={{ color: activeFiscalYear ? '#52c41a' : '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Exercice actuel */}
        {activeFiscalYear && (
          <Card title="Exercice en Cours" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  Exercice {activeFiscalYear.year}
                </div>
                <div style={{ color: '#666' }}>
                  {new Date(activeFiscalYear.startDate).toLocaleDateString()} - {new Date(activeFiscalYear.endDate).toLocaleDateString()}
                </div>
              </Col>
              <Col span={8}>
                <Tag color="green" icon={<CheckCircleOutlined />}>
                  Actif
                </Tag>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'right' }}>
                  <Button type="primary" size="small">
                    Gérer les Périodes
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        )}

        {/* Historique des exercices */}
        <Card title="Historique des Exercices" size="small">
          <Table
            columns={[
              {
                title: 'Année',
                dataIndex: 'year',
                key: 'year',
                render: (year: string) => <strong>{year}</strong>
              },
              {
                title: 'Période',
                dataIndex: 'startDate',
                key: 'period',
                render: (startDate: Date, record: any) => 
                  `${new Date(startDate).toLocaleDateString()} - ${new Date(record.endDate).toLocaleDateString()}`
              },
              {
                title: 'Statut',
                dataIndex: 'isClosed',
                key: 'status',
                render: (isClosed: boolean) => (
                  <Tag color={isClosed ? 'green' : 'blue'}>
                    {isClosed ? 'Clôturé' : 'Actif'}
                  </Tag>
                )
              },
              {
                title: 'Clôturé le',
                dataIndex: 'closedAt',
                key: 'closedAt',
                render: (date: Date) => date ? new Date(date).toLocaleDateString() : '-'
              }
            ]}
            dataSource={fiscalYears.sort((a, b) => parseInt(b.year) - parseInt(a.year))}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </Card>

        {/* Modal de création d'exercice */}
        <Modal
          title="Nouvel Exercice Comptable"
          open={setupModalVisible}
          onCancel={() => {
            setSetupModalVisible(false);
            setCurrentStep(0);
            form.resetFields();
          }}
          footer={null}
          width={800}
        >
          <Steps current={currentStep} items={steps} style={{ marginBottom: 24 }} />

          {currentStep === 0 && (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSetupFiscalYear}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="year"
                    label="Année de l'Exercice"
                    rules={[
                      { required: true, message: 'L\'année est requise' },
                      { pattern: /^\d{4}$/, message: 'Format année invalide (ex: 2024)' }
                    ]}
                  >
                    <Input placeholder="Ex: 2024" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="dateRange"
                    label="Période de l'Exercice"
                    rules={[{ required: true, message: 'La période est requise' }]}
                  >
                    <RangePicker 
                      style={{ width: '100%' }}
                      picker="year" 
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="copyFromPrevious"
                    label=" "
                    valuePropName="checked"
                  >
                    <Switch />
                    <span style={{ marginLeft: 8, fontWeight: 'bold' }}>Copier depuis exercice précédent</span>
                    <div style={{ color: '#666', fontSize: '12px', marginLeft: 24 }}>
                      Reprendre le plan comptable et la structure
                    </div>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="includeOpeningBalances"
                    label=" "
                    valuePropName="checked"
                  >
                    <Switch />
                    <span style={{ marginLeft: 8, fontWeight: 'bold' }}>Inclure soldes d'ouverture</span>
                    <div style={{ color: '#666', fontSize: '12px', marginLeft: 24 }}>
                      Calculer les soldes de clôture de l'exercice précédent
                    </div>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Button 
                  onClick={() => setSetupModalVisible(false)}
                  style={{ marginRight: 8 }}
                >
                  Annuler
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Continuer
                </Button>
              </Form.Item>
            </Form>
          )}

          {currentStep === 1 && (
            <div>
              <Alert
                message="Périodes générées automatiquement"
                description="Les périodes mensuelles et la période d'ajustement ont été créées."
                type="success"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Table
                columns={columns}
                dataSource={generatedPeriods}
                rowKey="number"
                pagination={false}
                size="small"
              />

              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <Button 
                  onClick={() => setCurrentStep(0)}
                  style={{ marginRight: 8 }}
                >
                  Retour
                </Button>
                <Button 
                  type="primary" 
                  onClick={() => setCurrentStep(2)}
                  icon={<PlayCircleOutlined />}
                >
                  Calculer les Soldes
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <Alert
                message="Calcul des soldes d'ouverture"
                description="Les soldes de clôture de l'exercice précédent sont en cours de calcul."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <PlayCircleOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: 16 }} />
                <div>Calcul des soldes en cours...</div>
                <div style={{ color: '#666', fontSize: '12px', marginTop: 8 }}>
                  Cette opération peut prendre quelques minutes
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <Button 
                  onClick={() => setCurrentStep(1)}
                  style={{ marginRight: 8 }}
                >
                  Retour
                </Button>
                <Button 
                  type="primary" 
                  onClick={() => setCurrentStep(3)}
                  loading={loading}
                >
                  Continuer
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <Alert
                message="Prêt à créer le nouvel exercice"
                description="Vérifiez les informations ci-dessous avant de finaliser la création."
                type="success"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Card title="Résumé de la Configuration" size="small">
                <Row gutter={16}>
                  <Col span={12}>
                    <div><strong>Année:</strong> {form.getFieldValue('year')}</div>
                    <div><strong>Périodes générées:</strong> {generatedPeriods.length}</div>
                  </Col>
                  <Col span={12}>
                    <div><strong>Soldes d'ouverture:</strong> {form.getFieldValue('includeOpeningBalances') ? 'Oui' : 'Non'}</div>
                    <div><strong>Copie structure:</strong> {form.getFieldValue('copyFromPrevious') ? 'Oui' : 'Non'}</div>
                  </Col>
                </Row>
              </Card>

              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <Button 
                  onClick={() => setCurrentStep(2)}
                  style={{ marginRight: 8 }}
                >
                  Retour
                </Button>
                <Button 
                  type="primary" 
                  onClick={handleCreateFiscalYear}
                  icon={<SaveOutlined />}
                  loading={periodLoading}
                >
                  Créer l'Exercice
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </Card>
    </motion.div>
  );
};

export default FiscalYear;