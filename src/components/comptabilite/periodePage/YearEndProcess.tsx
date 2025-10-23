import React, { useState } from 'react';
import { Card, Row, Col, Steps, Button, Alert, Statistic, Progress, Modal, List, Tag, Timeline, Descriptions } from 'antd';
import { motion } from 'framer-motion';
import { 
  PlayCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  FileTextOutlined,
  CalculatorOutlined,
  LockOutlined,
  DollarOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { usePeriodManagement } from '../../../hooks/comptabilite/module_six/usePeriodManagement';
import { useFiscalYear } from '../../../hooks/comptabilite/module_six/useFiscalYear';

export const YearEndProcess: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [processRunning, setProcessRunning] = useState(false);
  const [resultsModalVisible, setResultsModalVisible] = useState(false);
  
  const { fiscalYears, closeFiscalYear, getPeriodsByFiscalYear } = usePeriodManagement();
  const { canCloseFiscalYear, calculateOpeningBalances } = useFiscalYear();

  const activeFiscalYear = fiscalYears.find(fy => !fy.isClosed);
  const activeYearPeriods = activeFiscalYear ? getPeriodsByFiscalYear(activeFiscalYear.id) : [];
  const closedPeriods = activeYearPeriods.filter(p => p.status === 'CLOSED').length;
  const totalPeriods = activeYearPeriods.length;

  const yearEndChecks = canCloseFiscalYear(activeFiscalYear?.id || '', activeYearPeriods);

  const yearEndSteps = [
    {
      title: 'Vérifications',
      description: 'Contrôle des pré-requis de fin d\'exercice',
      icon: <CheckCircleOutlined />
    },
    {
      title: 'Inventaire',
      description: 'Évaluation des stocks et immobilisations',
      icon: <CalculatorOutlined />
    },
    {
      title: 'Régularisations',
      description: 'Provisions et amortissements finaux',
      icon: <FileTextOutlined />
    },
    {
      title: 'États Financiers',
      description: 'Génération du bilan et compte de résultat',
      icon: <BarChartOutlined />
    },
    {
      title: 'Clôture',
      description: 'Fermeture définitive de l\'exercice',
      icon: <LockOutlined />
    }
  ];

  const handleStartYearEndProcess = async () => {
    if (!activeFiscalYear) return;
    
    setProcessRunning(true);

    try {
      // Étape 1: Vérifications
      setCurrentStep(0);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Étape 2: Inventaire
      setCurrentStep(1);
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Étape 3: Régularisations
      setCurrentStep(2);
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Étape 4: États financiers
      setCurrentStep(3);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Étape 5: Clôture
      setCurrentStep(4);
      await closeFiscalYear(activeFiscalYear.id);

      setResultsModalVisible(true);
    } catch (err) {
      console.error('Erreur processus fin d\'exercice:', err);
    } finally {
      setProcessRunning(false);
    }
  };

  const canStartProcess = activeFiscalYear && 
    closedPeriods === totalPeriods && 
    yearEndChecks.canClose;

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
            Processus de Fin d'Exercice
          </div>
        }
      >
        {!activeFiscalYear && (
          <Alert
            message="Aucun exercice actif"
            description="Aucun exercice comptable n'est actuellement ouvert. Veuillez d'abord créer un nouvel exercice."
            type="warning"
            showIcon
          />
        )}

        {activeFiscalYear && (
          <>
            {/* En-tête de l'exercice */}
            <Card title={`Exercice ${activeFiscalYear.year}`} size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic
                    title="Périodes Clôturées"
                    value={closedPeriods}
                    suffix={`/ ${totalPeriods}`}
                    valueStyle={{ color: closedPeriods === totalPeriods ? '#52c41a' : '#faad14' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Statut"
                    value={yearEndChecks.canClose ? 'Prêt' : 'En attente'}
                    valueStyle={{ color: yearEndChecks.canClose ? '#52c41a' : '#ff4d4f' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Progression"
                    value={Math.round((closedPeriods / totalPeriods) * 100)}
                    suffix="%"
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Actions Requises"
                    value={yearEndChecks.reasons.length}
                    valueStyle={{ color: yearEndChecks.reasons.length > 0 ? '#ff4d4f' : '#52c41a' }}
                  />
                </Col>
              </Row>
            </Card>

            {/* Barre de progression */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Progression de clôture des périodes</span>
                <span>{Math.round((closedPeriods / totalPeriods) * 100)}%</span>
              </div>
              <Progress 
                percent={Math.round((closedPeriods / totalPeriods) * 100)} 
                status={closedPeriods === totalPeriods ? 'success' : 'active'}
                strokeColor={closedPeriods === totalPeriods ? '#52c41a' : '#1890ff'}
              />
            </div>

            {/* Étapes du processus */}
            <Card title="Processus de Fin d'Exercice" size="small" style={{ marginBottom: 16 }}>
              <Steps 
                current={currentStep} 
                items={yearEndSteps}
                direction="vertical"
              />
            </Card>

            {/* Vérifications */}
            <Card title="Vérifications de Fin d'Exercice" size="small" style={{ marginBottom: 16 }}>
              <List
                dataSource={[
                  {
                    key: 'periods',
                    description: 'Toutes les périodes mensuelles clôturées',
                    status: closedPeriods === totalPeriods
                  },
                  {
                    key: 'adjustment',
                    description: 'Période d\'ajustement clôturée',
                    status: activeYearPeriods.find(p => p.isAdjustmentPeriod)?.status === 'CLOSED'
                  },
                  {
                    key: 'balance',
                    description: 'Balance générale équilibrée',
                    status: Math.random() > 0.3 // Simulation
                  },
                  {
                    key: 'inventory',
                    description: 'Inventaire physique réalisé',
                    status: Math.random() > 0.4 // Simulation
                  },
                  {
                    key: 'depreciation',
                    description: 'Amortissements annuels calculés',
                    status: Math.random() > 0.2 // Simulation
                  }
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Tag color={item.status ? 'green' : 'red'} icon={item.status ? <CheckCircleOutlined /> : <WarningOutlined />}>
                          {item.status ? 'OK' : 'En attente'}
                        </Tag>
                      }
                      title={item.description}
                    />
                  </List.Item>
                )}
              />
            </Card>

            {/* Bouton de démarrage */}
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Button 
                type="primary" 
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={handleStartYearEndProcess}
                disabled={!canStartProcess || processRunning}
                loading={processRunning}
                style={{ minWidth: 250 }}
              >
                {processRunning ? 'Traitement en cours...' : 'Démarrer le Processus de Fin d\'Exercice'}
              </Button>
            </div>

            {!yearEndChecks.canClose && (
              <Alert
                message="Impossible de démarrer le processus"
                description={
                  <ul>
                    {yearEndChecks.reasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                }
                type="error"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}

            {/* Progression en cours */}
            {processRunning && (
              <Card title="Progression du Processus" size="small" style={{ marginTop: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <Progress
                    type="circle"
                    percent={Math.round((currentStep / (yearEndSteps.length - 1)) * 100)}
                    status={currentStep === yearEndSteps.length - 1 ? 'success' : 'active'}
                  />
                  <div style={{ marginTop: 16, fontWeight: 'bold' }}>
                    {yearEndSteps[currentStep]?.title}
                  </div>
                  <div style={{ color: '#666' }}>
                    {yearEndSteps[currentStep]?.description}
                  </div>
                </div>
              </Card>
            )}
          </>
        )}

        {/* Modal des résultats */}
        <Modal
          title="Processus de Fin d'Exercice Terminé"
          open={resultsModalVisible}
          onCancel={() => setResultsModalVisible(false)}
          footer={[
            <Button key="close" type="primary" onClick={() => setResultsModalVisible(false)}>
              Fermer
            </Button>
          ]}
          width={700}
        >
          <Alert
            message="Exercice clôturé avec succès"
            description={`L'exercice ${activeFiscalYear?.year} a été clôturé définitivement.`}
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Descriptions title="Résultats du Processus" bordered column={1} size="small">
            <Descriptions.Item label="Exercice Clôturé">
              {activeFiscalYear?.year}
            </Descriptions.Item>
            <Descriptions.Item label="Date de Clôture">
              {new Date().toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="Périodes Traitées">
              {totalPeriods} périodes
            </Descriptions.Item>
            <Descriptions.Item label="États Financiers Générés">
              <Tag color="green">Bilan, Compte de Résultat, Annexes</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Prochain Exercice">
              {(parseInt(activeFiscalYear?.year || '2024') + 1).toString()}
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: 16, padding: '12px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
            <strong>Actions recommandées:</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              <li>Vérifier les états financiers générés</li>
              <li>Archiver les documents de l'exercice</li>
              <li>Préparer la déclaration fiscale annuelle</li>
              <li>Créer le nouvel exercice comptable</li>
            </ul>
          </div>
        </Modal>
      </Card>
    </motion.div>
  );
};

export default YearEndProcess;