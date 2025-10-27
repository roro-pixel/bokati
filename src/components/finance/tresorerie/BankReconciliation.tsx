import React, { useState } from 'react';
import { Card, Form, Input, DatePicker, Select, Button, Table, Tag, Space, Divider, Statistic } from 'antd';
import { SearchOutlined, ReloadOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { BankAccount, BankTransaction, BankReconciliation as BankReconciliationType } from '../../../types';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface BankReconciliationProps {
  accounts: BankAccount[];
  onReconcile: (accountId: string, reconciliation: Omit<BankReconciliationType, 'id' | 'createdAt'>) => void;
}

export const BankReconciliation: React.FC<BankReconciliationProps> = ({
  accounts,
  onReconcile
}) => {
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [statementDate, setStatementDate] = useState<string>('');
  const [statementBalance, setStatementBalance] = useState<number>(0);
  const [unreconciledTransactions, setUnreconciledTransactions] = useState<BankTransaction[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);

  const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);

  // Données simulées pour les transactions non reconciliées
  const mockTransactions: BankTransaction[] = [
    {
      id: '1',
      bankAccountId: selectedAccount || '',
      transactionDate: new Date('2024-01-15'),
      valueDate: new Date('2024-01-15'),
      description: 'Virement client DUPONT',
      reference: 'VIR-2024-001',
      amount: 1500000,
      balance: 2500000,
      isReconciled: false,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      bankAccountId: selectedAccount || '',
      transactionDate: new Date('2024-01-16'),
      valueDate: new Date('2024-01-16'),
      description: 'Prélèvement fournisseur ABC',
      reference: 'PRE-2024-001',
      amount: -750000,
      balance: 1750000,
      isReconciled: false,
      createdAt: new Date('2024-01-16')
    },
    {
      id: '3',
      bankAccountId: selectedAccount || '',
      transactionDate: new Date('2024-01-17'),
      valueDate: new Date('2024-01-17'),
      description: 'Frais bancaires',
      reference: 'FRAIS-2024-01',
      amount: -25000,
      balance: 1725000,
      isReconciled: false,
      createdAt: new Date('2024-01-17')
    }
  ];

  const handleReconcile = () => {
    if (!selectedAccount || !statementDate || !statementBalance) return;

    const reconciliation: Omit<BankReconciliationType, 'id' | 'createdAt'> = {
      bankAccountId: selectedAccount,
      periodId: 'current-period',
      statementDate: new Date(statementDate),
      statementBalance: statementBalance,
      bookBalance: selectedAccountData?.currentBalance || 0,
      reconciledBalance: statementBalance,
      outstandingDeposits: 0,
      outstandingChecks: 0,
      bankCharges: 0,
      interestEarned: 0,
      status: 'COMPLETED'
    };

    onReconcile(selectedAccount, reconciliation);
    
    // Reset form
    setSelectedAccount('');
    setStatementDate('');
    setStatementBalance(0);
    setSelectedTransactions([]);
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      render: (date: Date) => new Date(date).toLocaleDateString('fr-FR')
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Référence',
      dataIndex: 'reference',
      key: 'reference',
    },
    {
      title: 'Débit',
      dataIndex: 'amount',
      key: 'debit',
      render: (amount: number) => amount < 0 ? (
        <span className="text-red-600">
          {new Intl.NumberFormat('fr-FR', { 
            style: 'currency', 
            currency: 'XAF' 
          }).format(Math.abs(amount))}
        </span>
      ) : null
    },
    {
      title: 'Crédit',
      dataIndex: 'amount',
      key: 'credit',
      render: (amount: number) => amount > 0 ? (
        <span className="text-green-600">
          {new Intl.NumberFormat('fr-FR', { 
            style: 'currency', 
            currency: 'XAF' 
          }).format(amount)}
        </span>
      ) : null
    },
    {
      title: 'Statut',
      dataIndex: 'isReconciled',
      key: 'status',
      render: (isReconciled: boolean) => (
        <Tag color={isReconciled ? 'green' : 'orange'} icon={isReconciled ? <CheckCircleOutlined /> : <SyncOutlined />}>
          {isReconciled ? 'Reconciliée' : 'En attente'}
        </Tag>
      )
    }
  ];

  const difference = statementBalance - (selectedAccountData?.currentBalance || 0);

  return (
    <div className="space-y-6">
      <Card 
        title={
          <div className="flex items-center">
            <SyncOutlined className="text-blue-500 mr-2" />
            Réconciliation Bancaire
          </div>
        }
        className="shadow-sm"
      >
        {/* Sélection du compte */}
        <Form layout="vertical" className="mb-6">
          <Form.Item label="Compte bancaire" required>
            <Select
              value={selectedAccount}
              onChange={setSelectedAccount}
              placeholder="Sélectionner un compte"
              size="large"
            >
              {accounts.map(account => (
                <Option key={account.id} value={account.id}>
                  <div className="flex justify-between">
                    <span>{account.name}</span>
                    <span className="text-gray-500">
                      {new Intl.NumberFormat('fr-FR', { 
                        style: 'currency', 
                        currency: 'XAF' 
                      }).format(account.currentBalance)}
                    </span>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>

        {selectedAccountData && (
          <>
            {/* Informations du compte */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-blue-600 font-medium">Solde comptable</div>
                  <div className="text-lg font-semibold">
                    {new Intl.NumberFormat('fr-FR', { 
                      style: 'currency', 
                      currency: 'XAF' 
                    }).format(selectedAccountData.currentBalance)}
                  </div>
                </div>
                <div>
                  <div className="text-blue-600 font-medium">Découvert autorisé</div>
                  <div className="text-lg font-semibold">
                    {new Intl.NumberFormat('fr-FR', { 
                      style: 'currency', 
                      currency: 'XAF' 
                    }).format(selectedAccountData.overdraftLimit)}
                  </div>
                </div>
                <div>
                  <div className="text-blue-600 font-medium">Banque</div>
                  <div className="font-medium">{selectedAccountData.bankName}</div>
                </div>
                <div>
                  <div className="text-blue-600 font-medium">N° de compte</div>
                  <div className="font-medium">{selectedAccountData.accountNumber}</div>
                </div>
              </div>
            </div>

            {/* Formulaire de réconciliation */}
            <Divider>Relevé bancaire</Divider>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <Form.Item label="Date du relevé" required>
                <Input
                  type="date"
                  value={statementDate}
                  onChange={(e) => setStatementDate(e.target.value)}
                  size="large"
                />
              </Form.Item>

              <Form.Item label="Solde du relevé" required>
                <Input
                  type="number"
                  value={statementBalance}
                  onChange={(e) => setStatementBalance(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  step="0.01"
                  size="large"
                  prefix="FCFA"
                />
              </Form.Item>
            </div>

            {/* Différence */}
            {statementBalance !== 0 && (
              <div className={`p-4 rounded-lg mb-6 ${
                Math.abs(difference) === 0 
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
              }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-lg">
                      {Math.abs(difference) === 0 
                        ? '✓ Compte reconcilié'
                        : '⚠ Différence détectée'
                      }
                    </div>
                    <div className="text-sm">
                      Écart: {new Intl.NumberFormat('fr-FR', { 
                        style: 'currency', 
                        currency: 'XAF' 
                      }).format(difference)}
                    </div>
                  </div>
                  {Math.abs(difference) !== 0 && (
                    <Button type="primary" danger size="small">
                      Ajuster la différence
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Transactions en attente */}
            <Divider>Transactions en attente de réconciliation</Divider>
            
            <Table
              columns={columns}
              dataSource={mockTransactions}
              rowKey="id"
              pagination={false}
              size="small"
              className="mb-6"
            />

            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Statistic
                title="Transactions en attente"
                value={mockTransactions.length}
                prefix={<SyncOutlined />}
              />
              <Statistic
                title="Total débits"
                value={Math.abs(mockTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))}
                prefix="FCFA"
                valueStyle={{ color: '#cf1322' }}
              />
              <Statistic
                title="Total crédits"
                value={mockTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)}
                prefix="FCFA"
                valueStyle={{ color: '#389e0d' }}
              />
            </div>

            {/* Bouton de réconciliation */}
            <div className="flex justify-end space-x-3">
              <Button icon={<ReloadOutlined />} size="large">
                Recharger les transactions
              </Button>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleReconcile}
                disabled={!statementDate || statementBalance === 0}
                size="large"
                className="bg-green-600 hover:bg-green-700"
              >
                Valider la réconciliation
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default BankReconciliation;