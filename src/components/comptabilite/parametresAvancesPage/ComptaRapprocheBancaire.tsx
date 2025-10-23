import React, { useState } from 'react';
import { Card, Row, Col, Table, Tag, Button, Alert, Statistic, Progress, Modal, Form, DatePicker, Input, Select, Steps } from 'antd';
import { motion } from 'framer-motion';
import { 
  SyncOutlined,
  // FileSearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BankOutlined,
  // UploadOutlined,
  // EyeOutlined
} from '@ant-design/icons';
import { useBankReconciliation } from '../../../hooks/comptabilite/module_height/useBankReconciliation';
import { BankAccount, BankTransaction, ReconciliationMatch } from '../../../types';

const { RangePicker } = DatePicker;
const { Option } = Select;

export const ComptaRapprocheBancaire: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [reconciliationInProgress, setReconciliationInProgress] = useState(false);
  const [showMatches, setShowMatches] = useState(false);
  const [suggestedMatches, setSuggestedMatches] = useState<ReconciliationMatch[]>([]);
  
  const {
    loading,
    error,
    bankAccounts,
    bankTransactions,
    reconciliations,
    startReconciliation,
    suggestMatches,
    validateReconciliation,
    importBankStatement,
    getUnreconciledTransactions
  } = useBankReconciliation();

  const [form] = Form.useForm();

  const handleStartReconciliation = async (values: any) => {
    if (!selectedAccount) return;
    
    setReconciliationInProgress(true);
    try {
      await startReconciliation(
        selectedAccount.id,
        'period-2024-06',
        values.statementDate,
        values.statementBalance
      );

      // Obtenir les suggestions automatiques
      const suggestions = await suggestMatches(`recon-${Date.now()}`);
      setSuggestedMatches(suggestions.suggestions);
      setShowMatches(true);
      
    } catch (err) {
      console.error('Erreur rapprochement:', err);
    } finally {
      setReconciliationInProgress(false);
    }
  };

  const handleValidateReconciliation = async () => {
    try {
      await validateReconciliation(`recon-${Date.now()}`, suggestedMatches);
      setShowMatches(false);
      Alert.success('Rapprochement validé avec succès!');
    } catch (err) {
      console.error('Erreur validation:', err);
    }
  };

  const unreconciledTransactions = selectedAccount ? 
    getUnreconciledTransactions(selectedAccount.id) : [];

  const transactionColumns = [
    {
      title: 'Date',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      width: 100,
      render: (date: Date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Référence',
      dataIndex: 'reference',
      key: 'reference',
      width: 120
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Montant',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount: number) => (
        <span style={{ color: amount >= 0 ? '#389e0d' : '#cf1322', fontWeight: 'bold' }}>
          {amount.toLocaleString()} FCFA
        </span>
      )
    },
    {
      title: 'Solde',
      dataIndex: 'balance',
      key: 'balance',
      width: 100,
      render: (balance: number) => balance.toLocaleString() + ' FCFA'
    },
    {
      title: 'Statut',
      dataIndex: 'isReconciled',
      key: 'status',
      width: 100,
      render: (reconciled: boolean) => (
        <Tag color={reconciled ? 'green' : 'orange'} icon={reconciled ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {reconciled ? 'Rapproché' : 'À rapprocher'}
        </Tag>
      )
    }
  ];

  const matchColumns = [
    {
      title: 'Transaction Bancaire',
      dataIndex: 'bankTransactionId',
      key: 'bankTransactionId',
      render: (id: string) => `TRX-${id.slice(-6)}`
    },
    {
      title: 'Écriture Comptable',
      dataIndex: 'journalEntryId',
      key: 'journalEntryId'
    },
    {
      title: 'Montant',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => amount.toLocaleString() + ' FCFA'
    },
    {
      title: 'Confiance',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (confidence: number) => (
        <Progress 
          percent={Math.round(confidence * 100)} 
          size="small" 
          status={confidence > 0.9 ? 'success' : confidence > 0.7 ? 'normal' : 'exception'}
        />
      )
    },
    {
      title: 'Différences',
      dataIndex: 'differences',
      key: 'differences',
      render: (diffs: string[]) => diffs.join(', ')
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
            <SyncOutlined />
            Rapprochement Bancaire
          </div>
        }
      >
        {error && (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />
        )}

        {/* Sélection du compte bancaire */}
        <Card title="Sélection du Compte Bancaire" size="small" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            {bankAccounts.map(account => (
              <Col span={8} key={account.id}>
                <Card 
                  size="small" 
                  hoverable
                  onClick={() => setSelectedAccount(account)}
                  style={{ 
                    border: selectedAccount?.id === account.id ? '2px solid #1890ff' : '1px solid #d9d9d9',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <BankOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: 8 }} />
                    <div style={{ fontWeight: 'bold' }}>{account.name}</div>
                    <div style={{ color: '#666', fontSize: '12px' }}>
                      {account.bankName} - {account.accountNumber}
                    </div>
                    <div style={{ marginTop: 8, fontWeight: 'bold' }}>
                      {account.currentBalance.toLocaleString()} FCFA
                    </div>
                    {selectedAccount?.id === account.id && (
                      <Tag color="blue" style={{ marginTop: 8 }}>
                        Sélectionné
                      </Tag>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {selectedAccount && (
          <>
            {/* Démarrer un rapprochement */}
            <Card title="Nouveau Rapprochement" size="small" style={{ marginBottom: 16 }}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleStartReconciliation}
              >
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      name="statementDate"
                      label="Date du Relevé"
                      rules={[{ required: true, message: 'La date est requise' }]}
                    >
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="statementBalance"
                      label="Solde du Relevé"
                      rules={[{ required: true, message: 'Le solde est requis' }]}
                    >
                      <Input addonAfter="FCFA" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label=" ">
                      <Button 
                        type="primary" 
                        htmlType="submit"
                        icon={<SyncOutlined />}
                        loading={reconciliationInProgress}
                        style={{ width: '100%' }}
                      >
                        Démarrer le Rapprochement
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>

            {/* Transactions à rapprocher */}
            <Card title="Transactions à Rapprocher" size="small" style={{ marginBottom: 16 }}>
              <Table
                columns={transactionColumns}
                dataSource={unreconciledTransactions}
                rowKey="id"
                pagination={false}
                size="small"
                scroll={{ y: 200 }}
              />
            </Card>

            {/* Statistiques */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Card size="small">
                  <Statistic
                    title="Transactions à Rapprocher"
                    value={unreconciledTransactions.length}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic
                    title="Solde Comptable"
                    value={selectedAccount.currentBalance}
                    suffix="FCFA"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic
                    title="Rapprochements Terminés"
                    value={reconciliations.filter(r => r.status === 'COMPLETED').length}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic
                    title="En Cours"
                    value={reconciliations.filter(r => r.status === 'IN_PROGRESS').length}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
            </Row>
          </>
        )}

        {!selectedAccount && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <BankOutlined style={{ fontSize: '48px', marginBottom: 16 }} />
            <div>Sélectionnez un compte bancaire pour commencer</div>
          </div>
        )}

        {/* Modal des suggestions de rapprochement */}
        <Modal
          title="Suggestions de Rapprochement Automatique"
          open={showMatches}
          onCancel={() => setShowMatches(false)}
          footer={[
            <Button key="cancel" onClick={() => setShowMatches(false)}>
              Annuler
            </Button>,
            <Button 
              key="validate" 
              type="primary" 
              onClick={handleValidateReconciliation}
            >
              Valider le Rapprochement
            </Button>
          ]}
          width={900}
        >
          <Alert
            message="Suggestions automatiques générées"
            description="Vérifiez les correspondances proposées avant validation."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Table
            columns={matchColumns}
            dataSource={suggestedMatches}
            rowKey="bankTransactionId"
            pagination={false}
            size="small"
          />

          <div style={{ marginTop: 16, padding: '12px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
            <strong>Conseil:</strong> Vérifiez particulièrement les transactions avec un score de confiance inférieur à 90%.
          </div>
        </Modal>
      </Card>
    </motion.div>
  );
};

export default ComptaRapprocheBancaire;