import React, { useState } from 'react';
import { Card, Row, Col, Table, Tag, Button, Modal, Alert, Statistic, Progress, Descriptions, Timeline } from 'antd';
import { motion } from 'framer-motion';
import { 
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  CalendarOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { usePeriodManagement } from '../../../hooks/comptabilite/module_six/usePeriodManagement';
import { AccountingPeriod, PeriodStatus } from '../../../types';

export const PeriodManagement: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<AccountingPeriod | null>(null);
  const [closingModalVisible, setClosingModalVisible] = useState(false);
  const [reopenModalVisible, setReopenModalVisible] = useState(false);
  
  const {
    periods,
    fiscalYears,
    loading,
    error,
    closePeriod,
    reopenPeriod,
    getPeriodStatus,
    getCurrentPeriod,
    getPeriodsByFiscalYear
  } = usePeriodManagement();

  const currentPeriod = getCurrentPeriod();
  const activeFiscalYear = fiscalYears.find(fy => !fy.isClosed);

  const handleClosePeriod = async (periodId: string) => {
    try {
      await closePeriod(periodId);
      setClosingModalVisible(false);
      setSelectedPeriod(null);
    } catch (err) {
      console.error('Erreur clôture période:', err);
    }
  };

  const handleReopenPeriod = async (periodId: string, reason: string) => {
    try {
      await reopenPeriod(periodId, reason);
      setReopenModalVisible(false);
      setSelectedPeriod(null);
    } catch (err) {
      console.error('Erreur réouverture période:', err);
    }
  };

  const getStatusColor = (status: PeriodStatus) => {
    switch (status) {
      case 'OPEN': return 'green';
      case 'CLOSED': return 'red';
      case 'LOCKED': return 'orange';
      default: return 'default';
    }
  };

  const getStatusText = (status: PeriodStatus) => {
    switch (status) {
      case 'OPEN': return 'Ouverte';
      case 'CLOSED': return 'Clôturée';
      case 'LOCKED': return 'Verrouillée';
      default: return status;
    }
  };

  const getStatusIcon = (status: PeriodStatus) => {
    switch (status) {
      case 'OPEN': return <UnlockOutlined />;
      case 'CLOSED': return <LockOutlined />;
      case 'LOCKED': return <LockOutlined />;
      default: return <CalendarOutlined />;
    }
  };

  const columns = [
    {
      title: 'Période',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: AccountingPeriod) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{name}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>
            {new Date(record.startDate).toLocaleDateString()} - {new Date(record.endDate).toLocaleDateString()}
          </div>
        </div>
      )
    },
    {
      title: 'Type',
      dataIndex: 'isAdjustmentPeriod',
      key: 'type',
      width: 100,
      render: (isAdjustment: boolean) => (
        <Tag color={isAdjustment ? 'orange' : 'blue'}>
          {isAdjustment ? 'Ajustement' : 'Mensuelle'}
        </Tag>
      )
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: PeriodStatus, record: AccountingPeriod) => (
        <Tag 
          color={getStatusColor(status)} 
          icon={getStatusIcon(status)}
          style={{ fontWeight: 'bold' }}
        >
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: 'Clôturée le',
      dataIndex: 'closedAt',
      key: 'closedAt',
      width: 120,
      render: (date: Date) => date ? new Date(date).toLocaleDateString() : '-'
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record: AccountingPeriod) => (
        <Button.Group size="small">
          <Button 
            icon={<EyeOutlined />}
            onClick={() => setSelectedPeriod(record)}
          >
            Détail
          </Button>
          {record.status === 'OPEN' && (
            <Button 
              icon={<LockOutlined />}
              onClick={() => {
                setSelectedPeriod(record);
                setClosingModalVisible(true);
              }}
            >
              Clôturer
            </Button>
          )}
          {record.status === 'CLOSED' && (
            <Button 
              icon={<UnlockOutlined />}
              onClick={() => {
                setSelectedPeriod(record);
                setReopenModalVisible(true);
              }}
            >
              Rouvrir
            </Button>
          )}
        </Button.Group>
      )
    }
  ];

  const currentYearPeriods = activeFiscalYear ? getPeriodsByFiscalYear(activeFiscalYear.id) : [];
  const closedPeriods = currentYearPeriods.filter(p => p.status === 'CLOSED').length;
  const totalPeriods = currentYearPeriods.length;
  const progressPercent = Math.round((closedPeriods / totalPeriods) * 100);

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
            Gestion des Périodes Comptables
          </div>
        }
      >
        {error && (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />
        )}

        {/* En-tête avec période courante et progression */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Période Courante"
                value={currentPeriod?.name || 'Aucune'}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Périodes Clôturées"
                value={closedPeriods}
                suffix={`/ ${totalPeriods}`}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Progression"
                value={progressPercent}
                suffix="%"
                valueStyle={{ color: progressPercent === 100 ? '#52c41a' : '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Exercice"
                value={activeFiscalYear?.year || 'N/A'}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Barre de progression */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Progression de clôture - Exercice {activeFiscalYear?.year}</span>
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

        {/* Table des périodes */}
        <Card title={`Périodes - Exercice ${activeFiscalYear?.year}`} size="small">
          <Table
            columns={columns}
            dataSource={currentYearPeriods.sort((a, b) => a.periodNumber - b.periodNumber)}
            rowKey="id"
            pagination={false}
            loading={loading}
            scroll={{ y: 400 }}
          />
        </Card>

        {/* Modal de détail de période */}
        {selectedPeriod && (
          <Modal
            title={`Détail Période - ${selectedPeriod.name}`}
            open={!!selectedPeriod}
            onCancel={() => setSelectedPeriod(null)}
            footer={[
              <Button key="close" onClick={() => setSelectedPeriod(null)}>
                Fermer
              </Button>
            ]}
            width={600}
          >
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Nom">{selectedPeriod.name}</Descriptions.Item>
              <Descriptions.Item label="Période">
                {new Date(selectedPeriod.startDate).toLocaleDateString()} - {new Date(selectedPeriod.endDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Type">
                <Tag color={selectedPeriod.isAdjustmentPeriod ? 'orange' : 'blue'}>
                  {selectedPeriod.isAdjustmentPeriod ? 'Période d\'ajustement' : 'Période mensuelle'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Statut">
                <Tag 
                  color={getStatusColor(selectedPeriod.status)} 
                  icon={getStatusIcon(selectedPeriod.status)}
                >
                  {getStatusText(selectedPeriod.status)}
                </Tag>
              </Descriptions.Item>
              {selectedPeriod.closedAt && (
                <Descriptions.Item label="Clôturée le">
                  {new Date(selectedPeriod.closedAt).toLocaleDateString()} par {selectedPeriod.closedBy}
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* Vérifications de clôture */}
            {selectedPeriod.status === 'OPEN' && (
              <div style={{ marginTop: 16 }}>
                <Card title="Vérifications de Clôture" size="small">
                  <Timeline>
                    {Object.entries(getPeriodStatus(selectedPeriod.id).checks).map(([key, value]) => (
                      <Timeline.Item
                        key={key}
                        dot={value ? 
                          <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
                          <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                        }
                        color={value ? 'green' : 'red'}
                      >
                        <div style={{ fontWeight: 'bold' }}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </div>
                        <div style={{ color: value ? '#52c41a' : '#ff4d4f', fontSize: '12px' }}>
                          {value ? 'Vérification réussie' : 'Action requise'}
                        </div>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Card>
              </div>
            )}
          </Modal>
        )}

        {/* Modal de clôture de période */}
        <Modal
          title={`Clôturer la période - ${selectedPeriod?.name}`}
          open={closingModalVisible}
          onCancel={() => setClosingModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setClosingModalVisible(false)}>
              Annuler
            </Button>,
            <Button 
              key="close" 
              type="primary" 
              danger
              onClick={() => selectedPeriod && handleClosePeriod(selectedPeriod.id)}
              loading={loading}
            >
              Confirmer la Clôture
            </Button>
          ]}
        >
          {selectedPeriod && (
            <div>
              <Alert
                message="Attention: Action irréversible"
                description="La clôture d'une période empêche toute modification ultérieure des écritures de cette période."
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Descriptions column={1} size="small">
                <Descriptions.Item label="Période">{selectedPeriod.name}</Descriptions.Item>
                <Descriptions.Item label="Statut actuel">
                  <Tag color="green">Ouverte</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Période suivante">
                  {currentYearPeriods.find(p => p.periodNumber === selectedPeriod.periodNumber + 1)?.name || 'Aucune'}
                </Descriptions.Item>
              </Descriptions>

              <div style={{ marginTop: 16, padding: '12px', backgroundColor: '#fff2e8', border: '1px solid #ffbb96' }}>
                <WarningOutlined style={{ color: '#fa8c16', marginRight: 8 }} />
                <strong>Vérifications requises avant clôture:</strong>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                  <li>Toutes les écritures doivent être validées</li>
                  <li>Les journaux doivent être équilibrés</li>
                  <li>Les rapprochements bancaires doivent être complétés</li>
                  <li>Les amortissements doivent être calculés</li>
                </ul>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal de réouverture de période */}
        <Modal
          title={`Rouvrir la période - ${selectedPeriod?.name}`}
          open={reopenModalVisible}
          onCancel={() => setReopenModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setReopenModalVisible(false)}>
              Annuler
            </Button>,
            <Button 
              key="reopen" 
              type="primary" 
              onClick={() => selectedPeriod && handleReopenPeriod(selectedPeriod.id, 'Correction requise')}
              loading={loading}
            >
              Confirmer la Réouverture
            </Button>
          ]}
        >
          {selectedPeriod && (
            <div>
              <Alert
                message="Réouverture exceptionnelle"
                description="Cette action doit être réservée aux corrections nécessaires. Toute réouverture est tracée dans l'audit."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Descriptions column={1} size="small">
                <Descriptions.Item label="Période">{selectedPeriod.name}</Descriptions.Item>
                <Descriptions.Item label="Statut actuel">
                  <Tag color="red">Clôturée</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Clôturée le">
                  {selectedPeriod.closedAt ? new Date(selectedPeriod.closedAt).toLocaleDateString() : 'N/A'}
                </Descriptions.Item>
              </Descriptions>

              <div style={{ marginTop: 16 }}>
                <strong>Motif de la réouverture:</strong>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                  <li>Correction d'erreurs comptables</li>
                  <li>Ajout d'écritures oubliées</li>
                  <li>Révision des régularisations</li>
                  <li>Autre (à préciser)</li>
                </ul>
              </div>
            </div>
          )}
        </Modal>
      </Card>
    </motion.div>
  );
};

export default PeriodManagement;