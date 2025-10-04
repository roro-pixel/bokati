import React, { useState } from 'react';
import { Menu, Dropdown, Button, Space, Modal, Form, Select, InputNumber, DatePicker } from 'antd';
import { 
  SettingOutlined, 
  CalculatorOutlined, 
  HistoryOutlined,
  SwapOutlined,
  FileSyncOutlined
} from '@ant-design/icons';

const { Option } = Select;

interface ComptaOptionsMenuSuperieurProps {
  onJournalChange: (journalId: string) => void;
  onCurrencyChange: (currency: string) => void;
  onExchangeRateSet: (rate: number) => void;
  onTemplateApply: (templateId: string) => void;
  currentJournal?: string;
  currentCurrency?: string;
}

const ComptaOptionsMenuSuperieur: React.FC<ComptaOptionsMenuSuperieurProps> = ({
  onJournalChange,
  onCurrencyChange,
  onExchangeRateSet,
  onTemplateApply,
  currentJournal = 'GEN',
  currentCurrency = 'XAF'
}) => {
  const [isExchangeModalVisible, setIsExchangeModalVisible] = useState(false);
  const [exchangeForm] = Form.useForm();

  const journalOptions = [
    { value: 'GEN', label: 'Journal Général' },
    { value: 'VTE', label: 'Journal des Ventes' },
    { value: 'ACH', label: 'Journal des Achats' },
    { value: 'BNQ', label: 'Journal de Banque' },
    { value: 'CAI', label: 'Journal de Caisse' }
  ];

  const currencyOptions = [
    { value: 'XAF', label: 'FCFA (XAF)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'USD', label: 'Dollar (USD)' }
  ];

  const templateOptions = [
    { value: 'salaires', label: 'Salaire mensuel' },
    { value: 'loyer', label: 'Paiement loyer' },
    { value: 'amortissement', label: 'Amortissement' },
    { value: 'tva', label: 'Déclaration TVA' }
  ];

  const handleExchangeRateSubmit = (values: any) => {
    onExchangeRateSet(values.exchangeRate);
    setIsExchangeModalVisible(false);
    exchangeForm.resetFields();
  };

  const menu = (
    <Menu
      items={[
        {
          key: 'journal',
          label: 'Changer de journal',
          icon: <FileSyncOutlined />,
          children: journalOptions.map(journal => ({
            key: `journal-${journal.value}`,
            label: journal.label,
            onClick: () => onJournalChange(journal.value)
          }))
        },
        {
          key: 'currency',
          label: 'Devise',
          icon: <SwapOutlined />,
          children: [
            ...currencyOptions.map(currency => ({
              key: `currency-${currency.value}`,
              label: currency.label,
              onClick: () => onCurrencyChange(currency.value)
            })),
            {
              type: 'divider'
            },
            {
              key: 'exchange-rate',
              label: 'Taux de change...',
              onClick: () => setIsExchangeModalVisible(true)
            }
          ]
        },
        {
          key: 'templates',
          label: 'Modèles',
          icon: <HistoryOutlined />,
          children: templateOptions.map(template => ({
            key: `template-${template.value}`,
            label: template.label,
            onClick: () => onTemplateApply(template.value)
          }))
        },
        {
          key: 'calculations',
          label: 'Calculs',
          icon: <CalculatorOutlined />,
          children: [
            {
              key: 'auto-balance',
              label: 'Équilibrer automatiquement'
            },
            {
              key: 'tax-calc',
              label: 'Calculateur TVA'
            }
          ]
        }
      ]}
    />
  );

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <span>Journal: </span>
        <Select 
          value={currentJournal} 
          onChange={onJournalChange}
          style={{ width: 150 }}
        >
          {journalOptions.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>

        <span>Devise: </span>
        <Select 
          value={currentCurrency} 
          onChange={onCurrencyChange}
          style={{ width: 120 }}
        >
          {currencyOptions.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>

        <Dropdown overlay={menu} placement="bottomRight">
          <Button icon={<SettingOutlined />}>Options</Button>
        </Dropdown>
      </Space>

      {/* Modal pour le taux de change */}
      <Modal
        title="Définir le taux de change"
        open={isExchangeModalVisible}
        onCancel={() => setIsExchangeModalVisible(false)}
        onOk={() => exchangeForm.submit()}
      >
        <Form
          form={exchangeForm}
          layout="vertical"
          onFinish={handleExchangeRateSubmit}
        >
          <Form.Item
            name="baseCurrency"
            label="Devise de base"
            initialValue={currentCurrency}
          >
            <Select disabled>
              {currencyOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="targetCurrency"
            label="Devise cible"
            initialValue="XAF"
          >
            <Select>
              {currencyOptions.filter(opt => opt.value !== currentCurrency).map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="exchangeRate"
            label="Taux de change"
            rules={[{ required: true, message: 'Le taux de change est requis' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={0.0001}
              precision={4}
              placeholder="Ex: 655.957"
            />
          </Form.Item>
          <Form.Item
            name="effectiveDate"
            label="Date d'effet"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ComptaOptionsMenuSuperieur;