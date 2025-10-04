// src/components/comptabilite/saisiePage/ComptaSaisiePieceComptable.tsx
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Input, 
  Select, 
  InputNumber, 
  Form,
  Modal,
  message 
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  EditOutlined,
  CalculatorOutlined 
} from '@ant-design/icons';
import { JournalEntry, JournalEntryLine, EntryLineType } from '../../../types';
import EntryValidation from './EntryValidation';
import { useTransactionProcessing } from '../../../hooks/comptabilite/module_five/useTransactionProcessing';
import { useEntryValidation } from '../../../hooks/comptabilite/module_five/useEntryValidation';

const { Option } = Select;
const { TextArea } = Input;

interface ComptaSaisiePieceComptableProps {
  initialEntry?: Partial<JournalEntry>;
  onSave?: (entry: JournalEntry) => void;
  onCancel?: () => void;
  readOnly?: boolean;
}

const ComptaSaisiePieceComptable: React.FC<ComptaSaisiePieceComptableProps> = ({
  initialEntry,
  onSave,
  onCancel,
  readOnly = false
}) => {
  const [entry, setEntry] = useState<Partial<JournalEntry>>(
    initialEntry || {
      journalId: 'GEN',
      entryDate: new Date(),
      accountingDate: new Date(),
      description: '',
      status: 'DRAFT',
      lines: [
        { 
          id: 'line-1', 
          entryId: 'temp', 
          accountId: '', 
          type: 'DEBIT', 
          amount: 0, 
          description: '',
          createdAt: new Date()
        },
        { 
          id: 'line-2', 
          entryId: 'temp', 
          accountId: '', 
          type: 'CREDIT', 
          amount: 0, 
          description: '',
          createdAt: new Date()
        }
      ]
    }
  );

  const { validateEntry } = useEntryValidation();
  const [validationResult, setValidationResult] = useState<any>(null);

  // Comptes simulés pour la démo
  const accountOptions = [
    { value: '701000', label: '701000 - Ventes de marchandises' },
    { value: '411000', label: '411000 - Clients' },
    { value: '512000', label: '512000 - Banque' },
    { value: '571000', label: '571000 - Caisse' },
    { value: '601000', label: '601000 - Achats de marchandises' },
    { value: '401000', label: '401000 - Fournisseurs' },
    { value: '445660', label: '445660 - TVA collectée' },
    { value: '445670', label: '445670 - TVA déductible' }
  ];

  useEffect(() => {
    if (entry.lines && entry.lines.length > 0) {
      const result = validateEntry(entry as JournalEntry);
      setValidationResult(result);
    }
  }, [entry, validateEntry]);

  const addLine = () => {
    setEntry(prev => ({
      ...prev,
      lines: [
        ...(prev.lines || []),
        {
          id: `line-${Date.now()}`,
          entryId: 'temp',
          accountId: '',
          type: 'DEBIT',
          amount: 0,
          description: '',
          createdAt: new Date()
        }
      ]
    }));
  };

  const removeLine = (lineId: string) => {
    if (entry.lines && entry.lines.length > 2) {
      setEntry(prev => ({
        ...prev,
        lines: prev.lines?.filter(line => line.id !== lineId)
      }));
    } else {
      message.warning('Une écriture doit avoir au moins 2 lignes');
    }
  };

  const updateLine = (lineId: string, field: string, value: any) => {
    setEntry(prev => ({
      ...prev,
      lines: prev.lines?.map(line => 
        line.id === lineId ? { ...line, [field]: value } : line
      )
    }));
  };

  const calculateTotals = () => {
    if (!entry.lines) return { debit: 0, credit: 0, difference: 0 };
    
    const totalDebit = entry.lines
      .filter(line => line.type === 'DEBIT')
      .reduce((sum, line) => sum + (line.amount || 0), 0);
    
    const totalCredit = entry.lines
      .filter(line => line.type === 'CREDIT')
      .reduce((sum, line) => sum + (line.amount || 0), 0);

    return {
      debit: totalDebit,
      credit: totalCredit,
      difference: Math.abs(totalDebit - totalCredit)
    };
  };

  const handleSave = () => {
    if (!validationResult?.isValid) {
      message.error('Veuillez corriger les erreurs avant de sauvegarder');
      return;
    }

    const completeEntry: JournalEntry = {
      ...entry,
      id: entry.id || `entry-${Date.now()}`,
      entryNumber: entry.entryNumber || `TEMP-${Date.now()}`,
      entity: entry.entity || 'current-entity',
      totalDebit: calculateTotals().debit,
      totalCredit: calculateTotals().credit,
      submittedBy: 'current-user',
      createdAt: entry.createdAt || new Date(),
      createdBy: entry.createdBy || 'current-user'
    } as JournalEntry;

    onSave?.(completeEntry);
    message.success('Écriture sauvegardée avec succès');
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: EntryLineType, record: any) => (
        <Select
          value={type}
          onChange={(value) => updateLine(record.id, 'type', value)}
          disabled={readOnly}
        >
          <Option value="DEBIT">Débit</Option>
          <Option value="CREDIT">Crédit</Option>
        </Select>
      )
    },
    {
      title: 'Compte',
      dataIndex: 'accountId',
      key: 'accountId',
      render: (accountId: string, record: any) => (
        <Select
          value={accountId}
          onChange={(value) => updateLine(record.id, 'accountId', value)}
          style={{ width: '100%' }}
          showSearch
          placeholder="Sélectionner un compte"
          disabled={readOnly}
          filterOption={(input, option) =>
            (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {accountOptions.map(acc => (
            <Option key={acc.value} value={acc.value} label={acc.label}>
              {acc.label}
            </Option>
          ))}
        </Select>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description: string, record: any) => (
        <Input
          value={description}
          onChange={(e) => updateLine(record.id, 'description', e.target.value)}
          placeholder="Description de la ligne"
          disabled={readOnly}
        />
      )
    },
    {
      title: 'Montant (FCFA)',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      render: (amount: number, record: any) => (
        <InputNumber
          value={amount}
          onChange={(value) => updateLine(record.id, 'amount', value)}
          min={0}
          step={100}
          style={{ width: '100%' }}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
          parser={value => value?.replace(/\s/g, '') as any}
          disabled={readOnly}
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_, record: any) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeLine(record.id)}
          disabled={readOnly || (entry.lines && entry.lines.length <= 2)}
        />
      )
    }
  ];

  const totals = calculateTotals();

  return (
    <div>
      {/* En-tête de l'écriture */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <span>Journal:</span>
            <Select 
              value={entry.journalId} 
              onChange={(value) => setEntry(prev => ({ ...prev, journalId: value }))}
              disabled={readOnly}
              style={{ width: 150 }}
            >
              <Option value="GEN">Général</Option>
              <Option value="VTE">Ventes</Option>
              <Option value="ACH">Achats</Option>
              <Option value="BNQ">Banque</Option>
              <Option value="CAI">Caisse</Option>
            </Select>

            <span>Description:</span>
            <Input
              value={entry.description}
              onChange={(e) => setEntry(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description de l'écriture"
              style={{ width: 300 }}
              disabled={readOnly}
            />
          </Space>
        </Space>
      </Card>

      {/* Tableau des lignes d'écriture */}
      <Card 
        title="Lignes d'écriture" 
        size="small"
        style={{ marginBottom: 16 }}
        extra={
          !readOnly && (
            <Button 
              type="dashed" 
              icon={<PlusOutlined />} 
              onClick={addLine}
              size="small"
            >
              Ajouter une ligne
            </Button>
          )
        }
      >
        <Table
          columns={columns}
          dataSource={entry.lines}
          pagination={false}
          size="small"
          scroll={{ x: 800 }}
          summary={() => (
            <Table.Summary>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}>
                  <Space>
                    <CalculatorOutlined />
                    <strong>Totaux:</strong>
                  </Space>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <div>
                    <div>Débit: <strong>{totals.debit.toLocaleString()} FCFA</strong></div>
                    <div>Crédit: <strong>{totals.credit.toLocaleString()} FCFA</strong></div>
                  </div>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <div style={{ 
                    color: totals.difference < 0.01 ? '#52c41a' : '#ff4d4f',
                    fontWeight: 'bold'
                  }}>
                    {totals.difference < 0.01 ? 'Équilibré' : `Différence: ${totals.difference.toFixed(2)} FCFA`}
                  </div>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>

      {/* Validation */}
      {validationResult && (
        <EntryValidation 
          validationResult={validationResult} 
          showDetails={true}
        />
      )}

      {/* Actions */}
      {!readOnly && (
        <div style={{ textAlign: 'right', marginTop: 16 }}>
          <Space>
            <Button onClick={onCancel}>
              Annuler
            </Button>
            <Button 
              type="primary" 
              onClick={handleSave}
              disabled={!validationResult?.isValid}
            >
              Sauvegarder l'écriture
            </Button>
          </Space>
        </div>
      )}
    </div>
  );
};

export default ComptaSaisiePieceComptable;