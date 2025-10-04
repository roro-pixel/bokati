import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Alert, 
  Progress,
  Statistic,
  Row,
  Col,
  Tooltip
} from 'antd';
import { 
  LockOutlined, 
  UnlockOutlined, 
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { Journal, JournalStatus } from '../../../types';
import { useJournalManagement } from '../../../hooks/comptabilite/module_four/useJournalManagement';

interface JournalClosingProps {
  periodId?: string;
}

const JournalClosing: React.FC<JournalClosingProps> = ({ 
  periodId = 'period-2024-01' 
}) => {
  const [closingModal, setClosingModal] = useState<{ visible: boolean; journal?: Journal }>({ 
    visible: false 
  });
  
  const { 
    journals, 
    journalStatus, 
    closeJournal, 
    reopenJournal,
    canCloseJournal 
  } = useJournalManagement();

  const handleCloseJournal = async (journal: Journal) => {
    try {
      await closeJournal(journal.id, periodId);
      setClosingModal({ visible: false });
    } catch (error) {
      console.error('Erreur lors de la clôture:', error);
    }
  };

  const handleReopenJournal = async (journal: Journal) => {
    try {
      await reopenJournal(journal.id, periodId);
    } catch (error) {
      console.error('Erreur lors de la réouverture:', error);
    }
  };

  const getJournalStatusInfo = (journal: Journal) => {
    const status = journalStatus.find(js => 
      js.journalId === journal.id && js.periodId === periodId
    );
    
    const closeCheck = canCloseJournal(journal.id, periodId);
    
    return {
      status,
      closeCheck,
      isClosed: status?.isClosed || false,
      canClose: closeCheck.canClose,
      closeReason: closeCheck.reason
    };
  };

  const columns = [
    {
      title: 'Journal',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Journal) => (
        <Space>
          <FileTextOutlined />
          <div>
            <div style={{ fontWeight: 'bold' }}>{name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Code: {record.code}</div>
          </div>
        </Space>
      )
    },
    {
      title: 'Statut',
      key: 'status',
      width: 120,
      render: (_, record: Journal) => {
        const { isClosed, status } = getJournalStatusInfo(record);
        
        return isClosed ? (
          <Tag color="red" icon={<LockOutlined />}>
            Clôturé
          </Tag>
        ) : (
          <Tag color="green" icon={<UnlockOutlined />}>
            Ouvert
          </Tag>
        );
      }
    },
    {
      title: 'Écritures',
      key: 'entries',
      width: 100,
      render: (_, record: Journal) => {
        const { status } = getJournalStatusInfo(record);
        return status ? status.totalEntries : 0;
      }
    },
    {
      title: 'Solde',
      key: 'balance',
      width: 150,
      render: (_, record: Journal) => {
        const { status } = getJournalStatusInfo(record);
        if (!status) return '-';
        
        const isBalanced = Math.abs(status.totalDebit - status.totalCredit) < 0.01;
        
        return (
          <Space direction="vertical" size={0}>
            <div>
              Débit: <strong>{status.totalDebit.toLocaleString()} FCFA</strong>
            </div>
            <div>
              Crédit: <strong>{status.totalCredit.toLocaleString()} FCFA</strong>
            </div>
            {!isBalanced && (
              <Tag color="red" size="small">
                Déséquilibré
              </Tag>
            )}
          </Space>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record: Journal) => {
        const { isClosed, canClose, closeReason, status } = getJournalStatusInfo(record);
        
        if (isClosed) {
          return (
            <Space>
              <Button 
                size="small" 
                icon={<EyeOutlined />}
                onClick={() => console.log('Voir détail', record)}
              >
                Détail
              </Button>
              <Button 
                size="small"
                icon={<UnlockOutlined />}
                onClick={() => handleReopenJournal(record)}
              >
                Rouvrir
              </Button>
            </Space>
          );
        }

        return (
          <Space>
            <Button 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => console.log('Voir détail', record)}
            >
              Détail
            </Button>
            <Tooltip title={canClose ? '' : closeReason}>
              <Button 
                type="primary"
                size="small"
                icon={<LockOutlined />}
                onClick={() => setClosingModal({ visible: true, journal: record })}
                disabled={!canClose}
              >
                Clôturer
              </Button>
            </Tooltip>
          </Space>
        );
      }
    }
  ];

  const openJournals = journals.filter(journal => {
    const { isClosed } = getJournalStatusInfo(journal);
    return !isClosed && journal.isActive;
  });

  const closedJournals = journals.filter(journal => {
    const { isClosed } = getJournalStatusInfo(journal);
    return isClosed;
  });

  const totalEntries = journalStatus.reduce((sum, js) => sum + js.totalEntries, 0);
  const totalAmount = journalStatus.reduce((sum, js) => sum + js.totalDebit, 0);

  return (
    <div>
      {/* Statistiques */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Journaux Ouverts"
              value={openJournals.length}
              suffix={`/ ${journals.length}`}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Écritures Total"
              value={totalEntries}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Montant Total"
              value={totalAmount}
              formatter={value => `${Number(value).toLocaleString()} FCFA`}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Taux de Clôture"
              value={Math.round((closedJournals.length / journals.length) * 100)}
              suffix="%"
              valueStyle={{ color: closedJournals.length === journals.length ? '#52c41a' : '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Journaux ouverts */}
      <Card 
        title="Journaux à Clôturer" 
        style={{ marginBottom: 16 }}
        extra={
          <Tag color="blue">
            {openJournals.length} journal(x) ouvert(s)
          </Tag>
        }
      >
        {openJournals.length === 0 ? (
          <Alert
            message="Tous les journaux sont clôturés"
            description="Tous les journaux ont été clôturés pour cette période."
            type="success"
            showIcon
          />
        ) : (
          <Table
            columns={columns}
            dataSource={openJournals}
            rowKey="id"
            pagination={false}
            size="small"
          />
        )}
      </Card>

      {/* Journaux clôturés */}
      {closedJournals.length > 0 && (
        <Card 
          title="Journaux Clôturés"
          extra={
            <Tag color="green">
              {closedJournals.length} journal(x) clôturé(s)
            </Tag>
          }
        >
          <Table
            columns={columns}
            dataSource={closedJournals}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </Card>
      )}

      {/* Modal de confirmation de clôture */}
      <Modal
        title="Confirmer la Clôture du Journal"
        open={closingModal.visible}
        onCancel={() => setClosingModal({ visible: false })}
        footer={[
          <Button key="cancel" onClick={() => setClosingModal({ visible: false })}>
            Annuler
          </Button>,
          <Button 
            key="confirm"
            type="primary" 
            icon={<LockOutlined />}
            onClick={() => closingModal.journal && handleCloseJournal(closingModal.journal)}
          >
            Confirmer la Clôture
          </Button>
        ]}
      >
        {closingModal.journal && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Alert
              message="Attention: Action irréversible"
              description="Une fois clôturé, le journal ne pourra plus accepter de nouvelles écritures pour cette période sans réouverture manuelle."
              type="warning"
              showIcon
            />
            
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <FileTextOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                {closingModal.journal.name}
              </div>
              <div style={{ color: '#666' }}>
                Code: {closingModal.journal.code}
              </div>
            </div>

            <div style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Résumé du journal:</div>
              {(() => {
                const { status } = getJournalStatusInfo(closingModal.journal);
                return status ? (
                  <Space direction="vertical">
                    <div>Écritures: {status.totalEntries}</div>
                    <div>Total Débit: {status.totalDebit.toLocaleString()} FCFA</div>
                    <div>Total Crédit: {status.totalCredit.toLocaleString()} FCFA</div>
                    <div>
                      Équilibre: {' '}
                      <Tag color={Math.abs(status.totalDebit - status.totalCredit) < 0.01 ? 'green' : 'red'}>
                        {Math.abs(status.totalDebit - status.totalCredit) < 0.01 ? 'Équilibré' : 'Déséquilibré'}
                      </Tag>
                    </div>
                  </Space>
                ) : null;
              })()}
            </div>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default JournalClosing;