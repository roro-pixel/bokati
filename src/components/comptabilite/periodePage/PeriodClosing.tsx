import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Tag, Button, Alert, Statistic, Progress, Modal, List, Steps, Timeline } from 'antd';
import { motion } from 'framer-motion';
import { 
  PlayCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  LockOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { usePeriodManagement } from '../../../hooks/comptabilite/module_six/usePeriodManagement';
import { AccountingPeriod, PeriodClosingCheck } from '../../../types';

export const PeriodClosing: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<AccountingPeriod | null>(null);
  const [closingInProgress, setClosingInProgress] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [closingResults, setClosingResults] = useState<PeriodClosingCheck | null>(null);
  
  const {
    periods,
    fiscalYears,
    loading,
    closePeriod,
    getPeriodStatus,
    getCurrentPeriod,
    getPeriodsByFiscalYear
  } = usePeriodManagement();

  const currentPeriod = getCurrentPeriod();
  const activeFiscalYear = fiscalYears.find(fy => !fy.isClosed);
  const openPeriods = periods.filter(p => p.status === 'OPEN' && !p.isAdjustmentPeriod);

  useEffect(() => {
    if (selectedPeriod) {
      const status = getPeriodStatus(selectedPeriod.id);
      setClosingResults(status);
    }
  }, [selectedPeriod, getPeriodStatus]);

  const handleStartClosing = async () => {
    if (!selectedPeriod) return;
    
    setClosingInProgress(true);
    setCurrentStep(0);

    try {
      // Étape 1: Vérifications pré-clôture
      setCurrentStep(1);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Étape 2: Calcul des amortissements
      setCurrentStep(2);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Étape 3: Génération des écritures de régularisation
      setCurrentStep(3);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Étape 4: Clôture effective
      setCurrentStep(4);
      await closePeriod(selectedPeriod.id);

      setCurrentStep(5);
    } catch (err) {
      console.error('Erreur lors de la clôture:', err);
      setCurrentStep(0);
    } finally {
      setClosingInProgress(false);
    }
  };

  const getCheckIcon = (passed: boolean) => {
    return passed ? 
      <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
      <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
  };

  const getCheckColor = (passed: boolean) => {
    return passed ? 'green' : 'red';
  };

  const closingSteps = [
    {
      title: 'Vérifications',
      description: 'Contrôle des pré-requis'
    },
    {
      title: 'Amortissements',
      description: 'Calcul des dotations'
    },
    {
      title: 'Régularisations',
      description: 'Écritures de fin de période'
    },
    {
      title: 'Clôture',
      description: 'Fermeture de la période'
    },
    {
      title: 'Terminé',
      description: 'Clôture réussie'
    }
  ];

  const verificationColumns = [
    {
      title: 'Vérification',
      dataIndex: 'description',
      key: 'description',
      render: (desc: string) => (
        <div style={{ fontWeight: 'bold' }}>{desc}</div>
      )
    },
    {
      title: 'Statut',
      dataIndex: 'passed',
      key: 'status',
      width: 100,
      render: (passed: boolean) => (
        <Tag color={getCheckColor(passed)} icon={getCheckIcon(passed)}>
          {passed ? 'OK' : 'Échec'}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      render: (_, record: any) => (
        !record.passed ? (
          <Button size="small" type="link">
            Corriger
          </Button>
        ) : null
      )
    }
  ];

  const verificationData = closingResults ? [
    {
      key: 'entries',
      description: 'Toutes les écritures sont validées et comptabilisées',
      passed: closingResults.checks.allEntriesPosted
    },
    {
      key: 'bank',
      description: 'Rapprochements bancaires complétés',
      passed: closingResults.checks.bankReconciliationsComplete
    },
    {
      key: 'depreciation',
      description: 'Amortissements calculés',
      passed: closingResults.checks.depreciationCalculated
    },
    {
      key: 'accruals',
      description: 'Provisions et régularisations enregistrées',
      passed: closingResults.checks.accrualsRecorded
    },
    {
      key: 'journals',
      description: 'Journaux équilibrés et clôturés',
      passed: closingResults.checks.noOpenJournals
    }
  ] : [];

  const canClosePeriod = closingResults?.canClose;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LockOutlined />
            Processus de Clôture de Période
          </div>
        }
        extra={
          <Button 
            icon={<ReloadOutlined />}
            onClick={() => selectedPeriod && setClosingResults(getPeriodStatus(selectedPeriod.id))}
          >
            Actualiser
          </Button>
        }
      >
        {/* Sélection de la période */}
        <Card title="Sélection de la Période à Clôturer" size="small" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            {openPeriods.slice(0, 3).map(period => (
              <Col span={8} key={period.id}>
                <Card 
                  size="small" 
                  hoverable
                  onClick={() => setSelectedPeriod(period)}
                  style={{ 
                    border: selectedPeriod?.id === period.id ? '2px solid #1890ff' : '1px solid #d9d9d9',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      {period.name}
                    </div>
                    <div style={{ color: '#666', fontSize: '12px' }}>
                      {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
                    </div>
                    {selectedPeriod?.id === period.id && (
                      <Tag color="blue" style={{ marginTop: 8 }}>
                        Sélectionnée
                      </Tag>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {selectedPeriod && (
          <>
            {/* En-tête de la période sélectionnée */}
            <Card title={`Clôture de ${selectedPeriod.name}`} size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic
                    title="Statut"
                    value={canClosePeriod ? 'Prête à clôturer' : 'Vérifications en cours'}
                    valueStyle={{ color: canClosePeriod ? '#52c41a' : '#faad14' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Vérifications OK"
                    value={verificationData.filter(v => v.passed).length}
                    suffix={`/ ${verificationData.length}`}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Progression"
                    value={Math.round((verificationData.filter(v => v.passed).length / verificationData.length) * 100)}
                    suffix="%"
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Actions Requises"
                    value={verificationData.filter(v => !v.passed).length}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Col>
              </Row>
            </Card>

            {/* Barre de progression des vérifications */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Progression des vérifications</span>
                <span>{Math.round((verificationData.filter(v => v.passed).length / verificationData.length) * 100)}%</span>
              </div>
              <Progress 
                percent={Math.round((verificationData.filter(v => v.passed).length / verificationData.length) * 100)} 
                status={canClosePeriod ? 'success' : 'active'}
                strokeColor={canClosePeriod ? '#52c41a' : '#1890ff'}
              />
            </div>

            {/* Table des vérifications */}
            <Card title="Vérifications de Pré-clôture" size="small" style={{ marginBottom: 16 }}>
              <Table
                columns={verificationColumns}
                dataSource={verificationData}
                pagination={false}
                size="small"
              />
            </Card>

            {/* Bouton de clôture */}
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Button 
                type="primary" 
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={handleStartClosing}
                disabled={!canClosePeriod || closingInProgress}
                loading={closingInProgress}
                style={{ minWidth: 200 }}
              >
                {closingInProgress ? 'Clôture en cours...' : 'Démarrer la Clôture'}
              </Button>
            </div>

            {/* Étapes de clôture en cours */}
            {closingInProgress && (
              <Card title="Processus de Clôture en Cours" size="small" style={{ marginTop: 16 }}>
                <Steps current={currentStep} items={closingSteps} />
                
                <div style={{ marginTop: 24, textAlign: 'center' }}>
                  <Progress
                    type="circle"
                    percent={Math.round((currentStep / (closingSteps.length - 1)) * 100)}
                    status={currentStep === closingSteps.length - 1 ? 'success' : 'active'}
                  />
                  <div style={{ marginTop: 16, fontWeight: 'bold' }}>
                    {closingSteps[currentStep]?.title}
                  </div>
                  <div style={{ color: '#666' }}>
                    {closingSteps[currentStep]?.description}
                  </div>
                </div>
              </Card>
            )}

            {/* Messages d'alerte */}
            {!canClosePeriod && verificationData.some(v => !v.passed) && (
              <Alert
                message="Actions requises avant clôture"
                description="Certaines vérifications ont échoué. Veuillez corriger les problèmes avant de procéder à la clôture."
                type="warning"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}

            {closingResults && closingResults.warnings.length > 0 && (
              <Alert
                message="Avertissements"
                description={
                  <ul>
                    {closingResults.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                }
                type="info"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}

            {closingResults && closingResults.errors.length > 0 && (
              <Alert
                message="Erreurs bloquantes"
                description={
                  <ul>
                    {closingResults.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                }
                type="error"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
          </>
        )}

        {!selectedPeriod && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <InfoCircleOutlined style={{ fontSize: '48px', marginBottom: 16 }} />
            <div>Sélectionnez une période à clôturer</div>
          </div>
        )}

        {/* Timeline des périodes clôturées */}
        <Card title="Historique des Clôtures Récentes" size="small" style={{ marginTop: 24 }}>
          <Timeline>
            {periods
              .filter(p => p.status === 'CLOSED')
              .sort((a, b) => new Date(b.closedAt!).getTime() - new Date(a.closedAt!).getTime())
              .slice(0, 5)
              .map(period => (
                <Timeline.Item
                  key={period.id}
                  dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                  color="green"
                >
                  <div style={{ fontWeight: 'bold' }}>{period.name}</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    Clôturée le {new Date(period.closedAt!).toLocaleDateString()} par {period.closedBy}
                  </div>
                </Timeline.Item>
              ))}
          </Timeline>
        </Card>
      </Card>
    </motion.div>
  );
};

export default PeriodClosing;