import React, { useState } from 'react';
import { Card, Row, Col, Button, Table, Tag, Alert, Statistic, Progress, Modal, List, Timeline } from 'antd';
import { motion } from 'framer-motion';
import { 
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  LockOutlined,
  UnlockOutlined
} from '@ant-design/icons';

// Types locaux pour la clôture
interface ClosingCheck {
  id: string;
  description: string;
  status: 'pending' | 'success' | 'warning' | 'error';
  details?: string;
  required: boolean;
}

interface ClosingStep {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
}

export const ComptaClotureBalance: React.FC = () => {
  const [closingInProgress, setClosingInProgress] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  // Données mock pour les vérifications
  const closingChecks: ClosingCheck[] = [
    {
      id: '1',
      description: 'Toutes les écritures sont validées et comptabilisées',
      status: 'success',
      details: 'Aucune écriture en attente trouvée',
      required: true
    },
    {
      id: '2',
      description: 'Balance générale équilibrée',
      status: 'success',
      details: 'Total débit: 1,250,000 FCFA = Total crédit: 1,250,000 FCFA',
      required: true
    },
    {
      id: '3',
      description: 'Rapprochements bancaires complétés',
      status: 'warning',
      details: '2 comptes bancaires sur 3 rapprochés',
      required: false
    },
    {
      id: '4',
      description: 'Amortissements calculés',
      status: 'success',
      details: 'Tous les amortissements mensuels calculés',
      required: true
    },
    {
      id: '5',
      description: 'Provisions constituées',
      status: 'pending',
      details: 'Vérification des provisions en cours',
      required: true
    },
    {
      id: '6',
      description: 'Journaux clôturés',
      status: 'success',
      details: 'Tous les journaux mensuels clôturés',
      required: true
    }
  ];

  const closingSteps: ClosingStep[] = [
    {
      id: '1',
      name: 'Vérification pré-clôture',
      status: 'completed',
      completedAt: new Date('2024-06-20T10:00:00')
    },
    {
      id: '2',
      name: 'Calcul des amortissements',
      status: 'completed',
      completedAt: new Date('2024-06-20T10:15:00')
    },
    {
      id: '3',
      name: 'Constituer les provisions',
      status: 'in-progress'
    },
    {
      id: '4',
      name: 'Générer les écritures de régularisation',
      status: 'pending'
    },
    {
      id: '5',
      name: 'Clôturer les journaux',
      status: 'pending'
    },
    {
      id: '6',
      name: 'Générer les états financiers',
      status: 'pending'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning': return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'error': return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default: return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'green';
      case 'warning': return 'orange';
      case 'error': return 'red';
      default: return 'blue';
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'in-progress': return <PlayCircleOutlined style={{ color: '#1890ff' }} />;
      case 'failed': return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default: return <InfoCircleOutlined style={{ color: '#d9d9d9' }} />;
    }
  };

  const canCloseBalance = closingChecks.every(check => 
    !check.required || check.status === 'success'
  );

  const handleStartClosing = async () => {
    setClosingInProgress(true);
    setModalVisible(true);
    
    // Simulation du processus de clôture
    for (let i = 0; i < closingSteps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2s par étape
      
      // Mettre à jour le statut de l'étape
      closingSteps[i].status = 'completed';
      closingSteps[i].completedAt = new Date();
    }
    
    setClosingInProgress(false);
  };

  const columns = [
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => getStatusIcon(status)
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (desc: string, record: ClosingCheck) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{desc}</div>
          {record.details && (
            <div style={{ color: '#666', fontSize: '12px' }}>{record.details}</div>
          )}
        </div>
      )
    },
    {
      title: 'Criticité',
      dataIndex: 'required',
      key: 'required',
      width: 100,
      render: (required: boolean) => (
        <Tag color={required ? 'red' : 'blue'}>
          {required ? 'Obligatoire' : 'Recommandé'}
        </Tag>
      )
    }
  ];

  const completedChecks = closingChecks.filter(check => check.status === 'success').length;
  const totalChecks = closingChecks.length;
  const progressPercent = Math.round((completedChecks / totalChecks) * 100);

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
            Clôture de la Balance Comptable
          </div>
        }
        extra={
          <Button 
            type="primary" 
            icon={closingInProgress ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={handleStartClosing}
            disabled={!canCloseBalance || closingInProgress}
            loading={closingInProgress}
          >
            {closingInProgress ? 'Clôture en cours...' : 'Démarrer la Clôture'}
          </Button>
        }
      >
        {!canCloseBalance && (
          <Alert
            message="Impossible de démarrer la clôture"
            description="Certaines vérifications obligatoires ne sont pas satisfaites. Veuillez corriger les problèmes avant de procéder à la clôture."
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Statistiques de progression */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Vérifications réussies"
                value={completedChecks}
                suffix={`/ ${totalChecks}`}
                valueStyle={{ color: completedChecks === totalChecks ? '#52c41a' : '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Progression globale"
                value={progressPercent}
                suffix="%"
                valueStyle={{ color: progressPercent === 100 ? '#52c41a' : '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Statut"
                value={canCloseBalance ? 'Prêt' : 'En attente'}
                valueStyle={{ color: canCloseBalance ? '#52c41a' : '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Période"
                value="Juin 2024"
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Barre de progression */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Progression des vérifications</span>
            <span>{progressPercent}%</span>
          </div>
          <Progress 
            percent={progressPercent} 
            status={progressPercent === 100 ? 'success' : 'active'}
            strokeColor={
              progressPercent === 100 ? '#52c41a' :
              progressPercent >= 80 ? '#1890ff' : '#faad14'
            }
          />
        </div>

        {/* Table des vérifications */}
        <Card title="Vérifications de Pré-clôture" size="small">
          <Table
            columns={columns}
            dataSource={closingChecks}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </Card>

        {/* Timeline du processus */}
        <Card title="Processus de Clôture" size="small" style={{ marginTop: 16 }}>
          <Timeline>
            {closingSteps.map((step, index) => (
              <Timeline.Item
                key={step.id}
                dot={getStepStatusIcon(step.status)}
                color={
                  step.status === 'completed' ? 'green' :
                  step.status === 'in-progress' ? 'blue' :
                  step.status === 'failed' ? 'red' : 'gray'
                }
              >
                <div style={{ fontWeight: index === currentStep ? 'bold' : 'normal' }}>
                  {step.name}
                </div>
                {step.completedAt && (
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    Terminé à {step.completedAt.toLocaleTimeString()}
                  </div>
                )}
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>

        {/* Modal de progression de clôture */}
        <Modal
          title="Processus de Clôture en Cours"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setModalVisible(false)}>
              Fermer
            </Button>
          ]}
          width={700}
        >
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Progress
              type="circle"
              percent={Math.round((currentStep + 1) / closingSteps.length * 100)}
              status={closingInProgress ? 'active' : 'success'}
            />
            <div style={{ marginTop: 16, fontSize: '16px', fontWeight: 'bold' }}>
              {closingInProgress ? 'Clôture en cours...' : 'Clôture terminée!'}
            </div>
            <div style={{ marginTop: 8, color: '#666' }}>
              {closingSteps[currentStep]?.name}
            </div>
          </div>

          <List
            dataSource={closingSteps}
            renderItem={(step, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={getStepStatusIcon(step.status)}
                  title={
                    <span style={{ 
                      fontWeight: index === currentStep ? 'bold' : 'normal',
                      color: index === currentStep ? '#1890ff' : 'inherit'
                    }}>
                      {step.name}
                    </span>
                  }
                  description={
                    step.completedAt && `Terminé à ${step.completedAt.toLocaleTimeString()}`
                  }
                />
              </List.Item>
            )}
          />
        </Modal>
      </Card>
    </motion.div>
  );
};

export default ComptaClotureBalance;