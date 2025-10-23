import React, { useState } from 'react';
import { Card, Row, Col, Button, Select, DatePicker, Table, Form, Tag, Descriptions } from 'antd';
import { motion } from 'framer-motion';
import { 
  FilePdfOutlined, 
  FileExcelOutlined,
  FilterOutlined,
  ReloadOutlined,
  BookOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useJournalManagement } from '../../../hooks/comptabilite/module_four/useJournalManagement';
import { Journal, JournalEntry, EntryStatus } from '../../../types';

const { Option } = Select;
const { RangePicker } = DatePicker;

// Données mock pour les écritures (à remplacer par un hook dédié si besoin)
const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    entryNumber: 'VTE-2024-0001',
    journalId: 'journal-2',
    entity: 'ENT001',
    entryDate: new Date('2024-06-15'),
    accountingDate: new Date('2024-06-15'),
    description: 'Vente client ABC - Facture F-2024-001',
    referenceDocument: 'F-2024-001',
    status: 'POSTED',
    totalDebit: 1500000,
    totalCredit: 1500000,
    lines: [
      {
        id: '1-1',
        entryId: '1',
        accountId: '411000',
        type: 'DEBIT',
        amount: 1500000,
        description: 'Client ABC',
        createdAt: new Date('2024-06-15')
      },
      {
        id: '1-2',
        entryId: '1',
        accountId: '701000',
        type: 'CREDIT',
        amount: 1500000,
        description: 'Vente marchandises',
        createdAt: new Date('2024-06-15')
      }
    ],
    submittedBy: 'user001',
    submittedAt: new Date('2024-06-15'),
    approvedBy: 'user002',
    approvedAt: new Date('2024-06-15'),
    postedBy: 'user001',
    postedAt: new Date('2024-06-15'),
    createdAt: new Date('2024-06-15'),
    createdBy: 'user001'
  }
];

export const ComptaLivreJournal: React.FC = () => {
  const [form] = Form.useForm();
  const [entries, setEntries] = useState<JournalEntry[]>(mockJournalEntries);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { journals, journalStatus } = useJournalManagement();

  const handleGenerateReport = async (values: any) => {
    setLoading(true);
    try {
      // Simulation de filtrage
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredEntries = [...mockJournalEntries];
      
      if (values.journals && values.journals.length > 0) {
        const selectedJournalIds = journals
          .filter(j => values.journals.includes(j.code))
          .map(j => j.id);
        
        filteredEntries = filteredEntries.filter(entry => 
          selectedJournalIds.includes(entry.journalId)
        );
      }
      
      setEntries(filteredEntries);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Livre Journal exporté en PDF avec succès!');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Livre Journal exporté en Excel avec succès!');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: EntryStatus) => {
    switch (status) {
      case 'POSTED': return 'green';
      case 'APPROVED': return 'blue';
      case 'SUBMITTED': return 'orange';
      case 'DRAFT': return 'default';
      case 'REJECTED': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status: EntryStatus) => {
    switch (status) {
      case 'POSTED': return 'Comptabilisée';
      case 'APPROVED': return 'Approuvée';
      case 'SUBMITTED': return 'Soumise';
      case 'DRAFT': return 'Brouillon';
      case 'REJECTED': return 'Rejetée';
      default: return status;
    }
  };

  const getJournalInfo = (journalId: string) => {
    return journals.find(j => j.id === journalId);
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'entryDate',
      key: 'entryDate',
      width: 100,
      render: (date: Date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'N° Pièce',
      dataIndex: 'entryNumber',
      key: 'entryNumber',
      width: 120
    },
    {
      title: 'Journal',
      dataIndex: 'journalId',
      key: 'journalId',
      width: 100,
      render: (journalId: string) => {
        const journal = getJournalInfo(journalId);
        return journal ? (
          <Tag color="purple">{journal.code}</Tag>
        ) : 'N/A';
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Débit Total',
      dataIndex: 'totalDebit',
      key: 'totalDebit',
      width: 100,
      render: (value: number) => (
        <strong style={{ color: '#cf1322' }}>{value.toLocaleString()}</strong>
      )
    },
    {
      title: 'Crédit Total',
      dataIndex: 'totalCredit',
      key: 'totalCredit',
      width: 100,
      render: (value: number) => (
        <strong style={{ color: '#389e0d' }}>{value.toLocaleString()}</strong>
      )
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: EntryStatus) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_, record: JournalEntry) => (
        <Button 
          size="small" 
          icon={<EyeOutlined />}
          onClick={() => setSelectedEntry(record)}
        >
          Détail
        </Button>
      )
    }
  ];

  const lineColumns = [
    {
      title: 'Compte',
      dataIndex: 'accountId',
      key: 'accountId',
      width: 100
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: string) => (
        <Tag color={type === 'DEBIT' ? 'red' : 'green'}>
          {type === 'DEBIT' ? 'Débit' : 'Crédit'}
        </Tag>
      )
    },
    {
      title: 'Montant',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount: number, record: any) => (
        <strong style={{ color: record.type === 'DEBIT' ? '#cf1322' : '#389e0d' }}>
          {amount.toLocaleString()}
        </strong>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    }
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
            <BookOutlined />
            Livre Journal
          </div>
        }
        extra={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button 
              icon={<FilePdfOutlined />} 
              onClick={handleExportPDF}
              disabled={entries.length === 0 || loading}
            >
              PDF
            </Button>
            <Button 
              icon={<FileExcelOutlined />} 
              onClick={handleExportExcel}
              disabled={entries.length === 0 || loading}
            >
              Excel
            </Button>
          </div>
        }
      >
        {/* Filtres */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleGenerateReport}
          >
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name="period" label="Période">
                  <Select placeholder="Sélectionner une période">
                    <Option value="2024-06">Juin 2024</Option>
                    <Option value="2024-05">Mai 2024</Option>
                    <Option value="2024-04">Avril 2024</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="dateRange" label="Plage de dates">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="journals" label="Journaux">
                  <Select mode="multiple" placeholder="Tous les journaux">
                    {journals.filter(j => j.isActive).map(journal => (
                      <Option key={journal.id} value={journal.code}>
                        {journal.code} - {journal.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label=" ">
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    icon={<ReloadOutlined />}
                    loading={loading}
                    style={{ width: '100%' }}
                  >
                    Charger Journal
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* Résultats */}
        {entries.length > 0 && (
          <Row gutter={16}>
            <Col span={selectedEntry ? 12 : 24}>
              <Card title="Écritures Journalières" size="small">
                <Table
                  columns={columns}
                  dataSource={entries}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  size="small"
                  scroll={{ y: 400 }}
                  loading={loading}
                />
              </Card>
            </Col>
            
            {selectedEntry && (
              <Col span={12}>
                <Card 
                  title={`Détail Écriture ${selectedEntry.entryNumber}`}
                  extra={
                    <Button size="small" onClick={() => setSelectedEntry(null)}>
                      Fermer
                    </Button>
                  }
                  size="small"
                >
                  <Descriptions column={1} size="small" bordered>
                    <Descriptions.Item label="Journal">
                      {getJournalInfo(selectedEntry.journalId)?.name || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Date Comptable">
                      {new Date(selectedEntry.accountingDate).toLocaleDateString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Description">
                      {selectedEntry.description}
                    </Descriptions.Item>
                    <Descriptions.Item label="Document Référence">
                      {selectedEntry.referenceDocument || 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Statut">
                      <Tag color={getStatusColor(selectedEntry.status)}>
                        {getStatusText(selectedEntry.status)}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Débit">
                      <strong>{selectedEntry.totalDebit.toLocaleString()} FCFA</strong>
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Crédit">
                      <strong>{selectedEntry.totalCredit.toLocaleString()} FCFA</strong>
                    </Descriptions.Item>
                  </Descriptions>

                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Lignes d'écriture:</div>
                    <Table
                      columns={lineColumns}
                      dataSource={selectedEntry.lines}
                      rowKey="id"
                      pagination={false}
                      size="small"
                    />
                  </div>
                </Card>
              </Col>
            )}
          </Row>
        )}

        {entries.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <FilterOutlined style={{ fontSize: '48px', marginBottom: 16 }} />
            <div>Configurez les filtres et chargez le Livre Journal</div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default ComptaLivreJournal;