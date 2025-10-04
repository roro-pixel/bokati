import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Tabs, 
  Space, 
  Button,
  Row,
  Col,
  Statistic,
  Tag
} from 'antd';
import { Table } from 'antd';
import { 
  FileTextOutlined, 
  SettingOutlined,
  PlusOutlined,
  LockOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { Journal } from '../../types';
import { useJournalManagement } from '../../hooks/comptabilite/module_four/useJournalManagement';

// Composants du Module 4
import JournalCreation from '../../components/comptabilite/journalPage/JournalCreation';
import JournalConfiguration from '../../components/comptabilite/journalPage/JournalConfiguration';
import JournalClosing from '../../components/comptabilite/journalPage/JournalClosing';
import JournalTypeSelector from '../../components/comptabilite/journalPage/JournalTypeSelector';

const { TabPane } = Tabs;

const ComptaJournalPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('gestion');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<Journal>();
  const [selectedType, setSelectedType] = useState<string>();

  const { journals, journalStatus, updateJournal } = useJournalManagement();

  const handleEditJournal = (journal: Journal) => {
    setSelectedJournal(journal);
    setCreateModalVisible(true);
  };

  const handleCreateSuccess = () => {
    setCreateModalVisible(false);
    setSelectedJournal(undefined);
    setSelectedType(undefined);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setCreateModalVisible(true);
  };

  // Statistiques
  const activeJournals = journals.filter(j => j.isActive);
  const closedJournals = journalStatus.filter(js => js.isClosed).length;
  const totalEntries = journalStatus.reduce((sum, js) => sum + js.totalEntries, 0);

  const journalListColumns = [
    {
      title: 'Journal',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Journal) => (
        <Space>
          <FileTextOutlined />
          <div>
            <div style={{ fontWeight: 'bold' }}>{name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.code} - {record.type}
            </div>
          </div>
        </Space>
      )
    },
    {
      title: 'Statut',
      key: 'status',
      render: (_, record: Journal) => (
        <Tag color={record.isActive ? 'green' : 'red'}>
          {record.isActive ? 'Actif' : 'Inactif'}
        </Tag>
      )
    },
    {
      title: 'Approbation',
      key: 'approval',
      render: (_, record: Journal) => (
        <Tag color={record.requiresApproval ? 'orange' : 'blue'}>
          {record.requiresApproval ? `Niveau ${record.approvalLevel}` : 'Auto'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Journal) => (
        <Space>
          <Button 
            size="small" 
            onClick={() => handleEditJournal(record)}
          >
            Modifier
          </Button>
          <Button 
            size="small"
            onClick={() => setSelectedJournal(record)}
          >
            Configurer
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      {/* En-tête avec statistiques */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Journaux Actifs"
              value={activeJournals.length}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Journaux Clôturés"
              value={closedJournals}
              prefix={<LockOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Écritures Total"
              value={totalEntries}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Types de Journaux"
              value={5}
              suffix="types"
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title={
            <Space>
                <Button 
                 icon={<ArrowLeftOutlined />} 
                 onClick={() => navigate('/comptabilite')}
                 type="text"
                />
                <span>Gestion des Journaux Comptables</span>
            </Space>
        }
        extra={
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setCreateModalVisible(true)}
            >
              Nouveau Journal
            </Button>
          </Space>
        }
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
        >
          <TabPane 
            key="gestion" 
            tab={
              <Space>
                <FileTextOutlined />
                Liste des Journaux
              </Space>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {/* Sélecteur de type pour nouveau journal */}
              <JournalTypeSelector
                onTypeSelect={handleTypeSelect}
              />

              {/* Liste des journaux existants */}
              <Card title="Journaux Configurés" size="small">
                <Table
                  columns={journalListColumns}
                  dataSource={journals}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  onRow={(record) => ({
                    onClick: () => setSelectedJournal(record),
                  })}
                />
              </Card>
            </Space>
          </TabPane>

          <TabPane 
            key="configuration" 
            tab={
              <Space>
                <SettingOutlined />
                Configuration
                {selectedJournal && (
                  <Tag color="blue">{selectedJournal.name}</Tag>
                )}
              </Space>
            }
            disabled={!selectedJournal}
          >
            {selectedJournal && (
              <JournalConfiguration
                journal={selectedJournal}
                onUpdate={updateJournal}
              />
            )}
          </TabPane>

          <TabPane 
            key="cloture" 
            tab={
              <Space>
                <LockOutlined />
                Clôture des Journaux
              </Space>
            }
          >
            <JournalClosing />
          </TabPane>
        </Tabs>
      </Card>

      {/* Modal de création/édition */}
      <JournalCreation
        open={createModalVisible}
        onClose={() => {
          setCreateModalVisible(false);
          setSelectedJournal(undefined);
          setSelectedType(undefined);
        }}
        onSuccess={handleCreateSuccess}
        editJournal={selectedJournal}
      />
    </div>
  );
};

export default ComptaJournalPage;