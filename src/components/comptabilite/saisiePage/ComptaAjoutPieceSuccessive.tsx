// src/components/comptabilite/saisiePage/ComptaAjoutPieceSuccessive.tsx
import React, { useState } from 'react';
import { Card, Form, Input, InputNumber, Select, Button, Space, Divider, message } from 'antd';
import { PlusOutlined, DeleteOutlined, CalculatorOutlined } from '@ant-design/icons';
import { JournalEntryLine, EntryLineType } from '../../../types';

const { Option } = Select;
const { TextArea } = Input;

interface ComptaAjoutPieceSuccessiveProps {
  onLinesAdd: (lines: JournalEntryLine[]) => void;
  onCancel: () => void;
}

const ComptaAjoutPieceSuccessive: React.FC<ComptaAjoutPieceSuccessiveProps> = ({
  onLinesAdd,
  onCancel
}) => {
  const [form] = Form.useForm();
  const [lines, setLines] = useState<Partial<JournalEntryLine>[]>([
    { type: 'DEBIT', amount: 0, description: '' },
    { type: 'CREDIT', amount: 0, description: '' }
  ]);

  const accountOptions = [
    { value: '701000', label: '701000 - Ventes de marchandises' },
    { value: '411000', label: '411000 - Clients' },
    { value: '512000', label: '512000 - Banque' },
    { value: '571000', label: '571000 - Caisse' },
    { value: '601000', label: '601000 - Achats de marchandises' },
    { value: '401000', label: '401000 - Fournisseurs' }
  ];

  const addLine = () => {
    setLines(prev => [...prev, { type: 'DEBIT', amount: 0, description: '' }]);
  };

  const removeLine = (index: number) => {
    if (lines.length > 2) {
      setLines(prev => prev.filter((_, i) => i !== index));
    } else {
      message.warning('Une écriture doit avoir au moins 2 lignes');
    }
  };

  const updateLine = (index: number, field: string, value: any) => {
    setLines(prev => prev.map((line, i) => 
      i === index ? { ...line, [field]: value } : line
    ));
  };

  const calculateBalance = () => {
    const totalDebit = lines
      .filter(line => line.type === 'DEBIT')
      .reduce((sum, line) => sum + (line.amount || 0), 0);
    
    const totalCredit = lines
      .filter(line => line.type === 'CREDIT')
      .reduce((sum, line) => sum + (line.amount || 0), 0);

    return {
      totalDebit,
      totalCredit,
      difference: totalDebit - totalCredit,
      isBalanced: Math.abs(totalDebit - totalCredit) < 0.01
    };
  };

  const handleSubmit = () => {
    const balance = calculateBalance();
    
    if (!balance.isBalanced) {
      message.error(`Écriture déséquilibrée! Différence: ${balance.difference.toFixed(2)} FCFA`);
      return;
    }

    // Valider que toutes les lignes ont un compte et un montant
    const invalidLines = lines.filter(line => !line.accountId || !line.amount || line.amount <= 0);
    if (invalidLines.length > 0) {
      message.error('Toutes les lignes doivent avoir un compte valide et un montant positif');
      return;
    }

    const completeLines: JournalEntryLine[] = lines.map((line, index) => ({
      id: `temp-line-${Date.now()}-${index}`,
      entryId: 'temp',
      accountId: line.accountId!,
      type: line.type as EntryLineType,
      amount: line.amount!,
      description: line.description || '',
      createdAt: new Date()
    }));

    onLinesAdd(completeLines);
    message.success('Lignes ajoutées avec succès');
    form.resetFields();
    setLines([
      { type: 'DEBIT', amount: 0, description: '' },
      { type: 'CREDIT', amount: 0, description: '' }
    ]);
  };

  const balance = calculateBalance();

  return (
    <Card 
      title="Saisie Rapide d'Écriture" 
      size="small"
      style={{ marginBottom: 16 }}
      extra={
        <Button type="link" onClick={onCancel}>
          Fermer
        </Button>
      }
    >
      <Form form={form} layout="vertical">
        {/* Lignes d'écriture */}
        {lines.map((line, index) => (
          <div key={index} style={{ marginBottom: 16, padding: 12, border: '1px solid #d9d9d9', borderRadius: 6 }}>
            <Space align="start" style={{ width: '100%' }}>
              {/* Type Débit/Crédit */}
              <Form.Item label="Type" style={{ margin: 0, width: 100 }}>
                <Select
                  value={line.type}
                  onChange={(value) => updateLine(index, 'type', value)}
                >
                  <Option value="DEBIT">Débit</Option>
                  <Option value="CREDIT">Crédit</Option>
                </Select>
              </Form.Item>

              {/* Compte */}
              <Form.Item label="Compte" style={{ margin: 0, flex: 1 }}>
                <Select
                  value={line.accountId}
                  onChange={(value) => updateLine(index, 'accountId', value)}
                  placeholder="Sélectionner un compte"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {accountOptions.map(acc => (
                    <Option key={acc.value} value={acc.value}>
                      {acc.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Montant */}
              <Form.Item label="Montant" style={{ margin: 0, width: 150 }}>
                <InputNumber
                  value={line.amount}
                  onChange={(value) => updateLine(index, 'amount', value)}
                  min={0}
                  step={100}
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  parser={value => value?.replace(/\s/g, '') as any}
                  placeholder="0 FCFA"
                />
              </Form.Item>

              {/* Bouton Supprimer */}
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeLine(index)}
                style={{ marginTop: 24 }}
                disabled={lines.length <= 2}
              />
            </Space>

            {/* Description */}
            <Form.Item label="Description" style={{ marginBottom: 0, marginTop: 8 }}>
              <TextArea
                value={line.description}
                onChange={(e) => updateLine(index, 'description', e.target.value)}
                placeholder="Description de la ligne..."
                rows={2}
              />
            </Form.Item>
          </div>
        ))}

        {/* Bouton Ajouter Ligne */}
        <Button 
          type="dashed" 
          icon={<PlusOutlined />} 
          onClick={addLine}
          style={{ width: '100%', marginBottom: 16 }}
        >
          Ajouter une ligne
        </Button>

        {/* Calcul d'équilibre */}
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <CalculatorOutlined />
            <span>
              Débit: <strong>{balance.totalDebit.toLocaleString()} FCFA</strong> | 
              Crédit: <strong>{balance.totalCredit.toLocaleString()} FCFA</strong>
            </span>
          </Space>
          <span style={{ 
            color: balance.isBalanced ? '#52c41a' : '#ff4d4f',
            fontWeight: 'bold'
          }}>
            {balance.isBalanced ? 'Équilibré' : `Différence: ${balance.difference.toFixed(2)} FCFA`}
          </span>
        </div>

        {/* Actions */}
        <div style={{ textAlign: 'right', marginTop: 16 }}>
          <Space>
            <Button onClick={onCancel}>
              Annuler
            </Button>
            <Button 
              type="primary" 
              onClick={handleSubmit}
              disabled={!balance.isBalanced}
            >
              Ajouter l'écriture
            </Button>
          </Space>
        </div>
      </Form>
    </Card>
  );
};

export default ComptaAjoutPieceSuccessive;