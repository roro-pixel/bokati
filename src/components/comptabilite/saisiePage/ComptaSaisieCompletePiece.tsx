import React, { useState } from 'react';
import { Card, Form, Input, DatePicker, Select, InputNumber, Row, Col, Divider } from 'antd';
import { JournalEntry, JournalEntryLine } from '../../../types';

const { TextArea } = Input;
const { Option } = Select;

interface ComptaSaisieCompletePieceProps {
  entry?: Partial<JournalEntry>;
  onChange: (entry: Partial<JournalEntry>) => void;
  readOnly?: boolean;
}

const ComptaSaisieCompletePiece: React.FC<ComptaSaisieCompletePieceProps> = ({
  entry = {},
  onChange,
  readOnly = false
}) => {
  const [form] = Form.useForm();

  const journalOptions = [
    { value: 'GEN', label: 'Journal Général' },
    { value: 'VTE', label: 'Journal des Ventes' },
    { value: 'ACH', label: 'Journal des Achats' },
    { value: 'BNQ', label: 'Journal de Banque' },
    { value: 'CAI', label: 'Journal de Caisse' }
  ];

  const handleValuesChange = (changedValues: any, allValues: any) => {
    onChange({
      ...entry,
      ...allValues,
      // S'assurer que la date comptable est définie
      accountingDate: allValues.accountingDate || entry.accountingDate || new Date()
    });
  };

  return (
    <Card title="En-tête de la pièce" size="small" style={{ marginBottom: 16 }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          journalId: entry.journalId || 'GEN',
          entryDate: entry.entryDate,
          accountingDate: entry.accountingDate || new Date(),
          description: entry.description || '',
          referenceDocument: entry.referenceDocument || ''
        }}
        onValuesChange={handleValuesChange}
        disabled={readOnly}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="journalId"
              label="Journal"
              rules={[{ required: true, message: 'Le journal est requis' }]}
            >
              <Select placeholder="Sélectionner un journal">
                {journalOptions.map(journal => (
                  <Option key={journal.value} value={journal.value}>
                    {journal.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              name="entryDate"
              label="Date d'écriture"
              rules={[{ required: true, message: 'La date d\'écriture est requise' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                format="DD/MM/YYYY"
                placeholder="Date d'écriture"
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              name="accountingDate"
              label="Date de comptabilisation"
              rules={[{ required: true, message: 'La date de comptabilisation est requise' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                format="DD/MM/YYYY"
                placeholder="Date comptable"
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              name="referenceDocument"
              label="Référence document"
            >
              <Input placeholder="N° facture, bon, etc." />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Description de l'écriture"
          rules={[{ required: true, message: 'La description est requise' }]}
        >
          <TextArea
            rows={3}
            placeholder="Description détaillée de l'opération..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        {/* Informations calculées (lecture seule) */}
        {readOnly && entry.entryNumber && (
          <>
            <Divider />
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="Numéro d'écriture">
                  <Input value={entry.entryNumber} disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Statut">
                  <Input 
                    value={
                      entry.status === 'DRAFT' ? 'Brouillon' :
                      entry.status === 'SUBMITTED' ? 'Soumis' :
                      entry.status === 'APPROVED' ? 'Approuvé' :
                      entry.status === 'POSTED' ? 'Posté' : 'Rejeté'
                    } 
                    disabled 
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Total Débit">
                  <InputNumber
                    value={entry.totalDebit}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA'}
                    style={{ width: '100%' }}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Total Crédit">
                  <InputNumber
                    value={entry.totalCredit}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA'}
                    style={{ width: '100%' }}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </Form>
    </Card>
  );
};

export default ComptaSaisieCompletePiece;