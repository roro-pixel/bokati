import React, { useState } from 'react';
import { Card, Row, Col, Button, Select, DatePicker, Table, Input, Form, Tag, Statistic } from 'antd';
import { motion } from 'framer-motion';
import { 
  FileSearchOutlined, 
  FilePdfOutlined, 
  FileExcelOutlined,
  FilterOutlined,
  ReloadOutlined,
  BookOutlined
} from '@ant-design/icons';
import { useGeneralLedger } from '../../../hooks/comptabilite/module_ten/useGeneralLedger';
import { GeneralLedgerReport, ReportFilter } from '../../../types';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

export const ComptaEditerEtatComptable: React.FC = () => {
  const [form] = Form.useForm();
  const [reports, setReports] = useState<GeneralLedgerReport[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  
  const { loading, error, generateGeneralLedger, exportGeneralLedger } = useGeneralLedger();

  const handleGenerateReport = async (values: any) => {
    const filter: ReportFilter = {
      periodId: values.period,
      startDate: values.dateRange?.[0],
      endDate: values.dateRange?.[1],
      accountCodes: values.accounts,
      journalIds: values.journals,
      includePostedOnly: true,
      includeDraft: false
    };

    try {
      const result = await generateGeneralLedger(filter);
      setReports(result);
    } catch (err) {
      console.error('Erreur génération Grand Livre:', err);
    }
  };

  const handleExportPDF = async () => {
    await exportGeneralLedger(reports, 'PDF');
  };

  const handleExportExcel = async () => {
    await exportGeneralLedger(reports, 'EXCEL');
  };

  const accountColumns = [
    {
      title: 'Compte',
      dataIndex: 'accountCode',
      key: 'accountCode',
      width: 120,
      render: (code: string, record: GeneralLedgerReport) => (
        <div>
          <strong>{code}</strong>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.accountName}</div>
        </div>
      )
    },
    {
      title: 'Débit Ouverture',
      dataIndex: 'openingDebit',
      key: 'openingDebit',
      render: (value: number) => value > 0 ? value.toLocaleString() : '-'
    },
    {
      title: 'Crédit Ouverture',
      dataIndex: 'openingCredit',
      key: 'openingCredit',
      render: (value: number) => value > 0 ? value.toLocaleString() : '-'
    },
    {
      title: 'Débit Période',
      dataIndex: 'totalDebit',
      key: 'totalDebit',
      render: (value: number) => value > 0 ? value.toLocaleString() : '-'
    },
    {
      title: 'Crédit Période',
      dataIndex: 'totalCredit',
      key: 'totalCredit',
      render: (value: number) => value > 0 ? value.toLocaleString() : '-'
    },
    {
      title: 'Solde Débiteur',
      dataIndex: 'closingDebit',
      key: 'closingDebit',
      render: (value: number) => value > 0 ? (
        <Tag color="blue">{value.toLocaleString()}</Tag>
      ) : '-'
    },
    {
      title: 'Solde Créditeur',
      dataIndex: 'closingCredit',
      key: 'closingCredit',
      render: (value: number) => value > 0 ? (
        <Tag color="green">{value.toLocaleString()}</Tag>
      ) : '-'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: GeneralLedgerReport) => (
        <Button 
          size="small" 
          onClick={() => setSelectedAccount(record.accountCode)}
          icon={<FileSearchOutlined />}
        >
          Détail
        </Button>
      )
    }
  ];

  const entryColumns = [
    {
      title: 'Date',
      dataIndex: 'entryDate',
      key: 'entryDate',
      render: (date: Date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'N° Pièce',
      dataIndex: 'entryNumber',
      key: 'entryNumber'
    },
    {
      title: 'Journal',
      dataIndex: 'journalCode',
      key: 'journalCode',
      render: (code: string) => <Tag color="purple">{code}</Tag>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Débit',
      dataIndex: 'debit',
      key: 'debit',
      render: (value: number) => value > 0 ? (
        <strong style={{ color: '#cf1322' }}>{value.toLocaleString()}</strong>
      ) : '-'
    },
    {
      title: 'Crédit',
      dataIndex: 'credit',
      key: 'credit',
      render: (value: number) => value > 0 ? (
        <strong style={{ color: '#389e0d' }}>{value.toLocaleString()}</strong>
      ) : '-'
    },
    {
      title: 'Solde',
      dataIndex: 'balance',
      key: 'balance',
      render: (value: number) => (
        <Tag color={value >= 0 ? 'blue' : 'green'}>
          {Math.abs(value).toLocaleString()}
        </Tag>
      )
    }
  ];

  const selectedAccountData = reports.find(r => r.accountCode === selectedAccount);

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
            Grand Livre - États Comptables
          </div>
        }
        extra={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button 
              icon={<FilePdfOutlined />} 
              onClick={handleExportPDF}
              disabled={reports.length === 0 || loading}
            >
              PDF
            </Button>
            <Button 
              icon={<FileExcelOutlined />} 
              onClick={handleExportExcel}
              disabled={reports.length === 0 || loading}
            >
              Excel
            </Button>
          </div>
        }
      >
        {error && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: '#ff4d4f', marginBottom: 8 }}>{error}</div>
          </div>
        )}

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
                <Form.Item name="accounts" label="Comptes">
                  <Select mode="multiple" placeholder="Tous les comptes">
                    <Option value="701000">701000 - Ventes</Option>
                    <Option value="411000">411000 - Clients</Option>
                    <Option value="512000">512000 - Banque</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="journals" label="Journaux">
                  <Select mode="multiple" placeholder="Tous les journaux">
                    <Option value="VTE">VTE - Ventes</Option>
                    <Option value="ACH">ACH - Achats</Option>
                    <Option value="BNQ">BNQ - Banque</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  icon={<ReloadOutlined />}
                  loading={loading}
                >
                  Générer Grand Livre
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* Résultats */}
        {reports.length > 0 && (
          <Row gutter={16}>
            <Col span={selectedAccount ? 12 : 24}>
              <Card title="Liste des Comptes" size="small">
                <Table
                  columns={accountColumns}
                  dataSource={reports}
                  rowKey="accountCode"
                  pagination={false}
                  size="small"
                  scroll={{ y: 400 }}
                />
              </Card>
            </Col>
            
            {selectedAccount && selectedAccountData && (
              <Col span={12}>
                <Card 
                  title={`Détail Compte ${selectedAccount}`}
                  extra={
                    <Button size="small" onClick={() => setSelectedAccount('')}>
                      Fermer
                    </Button>
                  }
                  size="small"
                >
                  <div style={{ marginBottom: 16 }}>
                    <Statistic
                      title="Solde Final"
                      value={Math.abs(selectedAccountData.closingDebit - selectedAccountData.closingCredit)}
                      prefix={selectedAccountData.closingDebit > 0 ? "Débiteur:" : "Créditeur:"}
                      suffix="FCFA"
                    />
                  </div>
                  
                  <Table
                    columns={entryColumns}
                    dataSource={selectedAccountData.entries}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    scroll={{ y: 300 }}
                  />
                </Card>
              </Col>
            )}
          </Row>
        )}

        {reports.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <FilterOutlined style={{ fontSize: '48px', marginBottom: 16 }} />
            <div>Configurez les filtres et générez le Grand Livre</div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default ComptaEditerEtatComptable;