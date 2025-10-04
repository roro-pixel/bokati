import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Select, 
  Input, 
  Switch, 
  Space, 
  Button, 
  Row, 
  Col,
  Alert,
  Divider
} from 'antd';
import { 
  SaveOutlined,
  ReloadOutlined 
} from '@ant-design/icons';
import { Journal } from '../../../types';
import { useJournalManagement } from '../../../hooks/comptabilite/module_four/useJournalManagement';

const { Option } = Select;

interface JournalConfigurationProps {
  journal: Journal;
  onUpdate: (updates: Partial<Journal>) => void;
}

const JournalConfiguration: React.FC<JournalConfigurationProps> = ({
  journal,
  onUpdate
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Comptes disponibles (mock harmonisé avec Module 3)
  const accountOptions = [
    { value: '411000', label: '411000 - Clients' },
    { value: '401000', label: '401000 - Fournisseurs' },
    { value: '512000', label: '512000 - Banque' },
    { value: '571000', label: '571000 - Caisse' },
    { value: '701000', label: '701000 - Ventes de marchandises' },
    { value: '601000', label: '601000 - Achats de marchandises' },
    { value: '445660', label: '445660 - TVA collectée' },
    { value: '445670', label: '445670 - TVA déductible' }
  ];

  useEffect(() => {
    if (journal) {
      form.setFieldsValue({
        ...journal.defaultAccounts,
        requiresApproval: journal.requiresApproval,
        approvalLevel: journal.approvalLevel,
        isActive: journal.isActive
      });
    }
  }, [journal, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const updates: Partial<Journal> = {
        requiresApproval: values.requiresApproval,
        approvalLevel: values.approvalLevel,
        isActive: values.isActive,
        defaultAccounts: {
          customerAccount: values.customerAccount,
          supplierAccount: values.supplierAccount,
          bankAccount: values.bankAccount,
          cashAccount: values.cashAccount,
          salesAccount: values.salesAccount,
          expenseAccount: values.expenseAccount
        }
      };

      await onUpdate(updates);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultAccountsForType = () => {
    switch (journal.type) {
      case 'VTE':
        return {
          customerAccount: '411000',
          salesAccount: '701000',
          bankAccount: '512000'
        };
      case 'ACH':
        return {
          supplierAccount: '401000', 
          expenseAccount: '601000',
          bankAccount: '512000'
        };
      case 'BNQ':
        return {
          bankAccount: '512000'
        };
      case 'CAI':
        return {
          cashAccount: '571000'
        };
      default:
        return {};
    }
  };

  const handleResetDefaults = () => {
    const defaults = getDefaultAccountsForType();
    form.setFieldsValue(defaults);
  };

  return (
    <Card 
      title={`Configuration - ${journal.name}`}
      extra={
        <Space>
          <Button 
            icon={<ReloadOutlined />}
            onClick={handleResetDefaults}
          >
            Valeurs par défaut
          </Button>
          <Button 
            type="primary" 
            icon={<SaveOutlined />}
            loading={loading}
            onClick={handleSubmit}
          >
            Sauvegarder
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
      >
        {/* Configuration générale */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="requiresApproval"
              label="Approbation requise"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="approvalLevel"
              label="Niveau d'approbation"
            >
              <Select>
                <Option value={1}>Niveau 1 - Manager</Option>
                <Option value={2}>Niveau 2 - Directeur Financier</Option>
                <Option value={3}>Niveau 3 - Directeur Général</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="isActive"
          label="Journal Actif"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Divider>Comptes par Défaut</Divider>

        {/* Comptes par défaut selon le type de journal */}
        <Row gutter={16}>
          {(journal.type === 'VTE' || journal.type === 'GEN') && (
            <Col span={12}>
              <Form.Item
                name="customerAccount"
                label="Compte Clients par défaut"
              >
                <Select 
                  placeholder="Sélectionner le compte clients"
                  showSearch
                >
                  {accountOptions
                    .filter(acc => acc.value.startsWith('41'))
                    .map(acc => (
                    <Option key={acc.value} value={acc.value}>
                      {acc.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}

          {(journal.type === 'VTE' || journal.type === 'GEN') && (
            <Col span={12}>
              <Form.Item
                name="salesAccount"
                label="Compte Ventes par défaut"
              >
                <Select 
                  placeholder="Sélectionner le compte ventes"
                  showSearch
                >
                  {accountOptions
                    .filter(acc => acc.value.startsWith('70'))
                    .map(acc => (
                    <Option key={acc.value} value={acc.value}>
                      {acc.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}

          {(journal.type === 'ACH' || journal.type === 'GEN') && (
            <Col span={12}>
              <Form.Item
                name="supplierAccount"
                label="Compte Fournisseurs par défaut"
              >
                <Select 
                  placeholder="Sélectionner le compte fournisseurs"
                  showSearch
                >
                  {accountOptions
                    .filter(acc => acc.value.startsWith('40'))
                    .map(acc => (
                    <Option key={acc.value} value={acc.value}>
                      {acc.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}

          {(journal.type === 'ACH' || journal.type === 'GEN') && (
            <Col span={12}>
              <Form.Item
                name="expenseAccount"
                label="Compte Achats par défaut"
              >
                <Select 
                  placeholder="Sélectionner le compte achats"
                  showSearch
                >
                  {accountOptions
                    .filter(acc => acc.value.startsWith('60'))
                    .map(acc => (
                    <Option key={acc.value} value={acc.value}>
                      {acc.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}

          {(journal.type === 'BNQ' || journal.type === 'GEN') && (
            <Col span={12}>
              <Form.Item
                name="bankAccount"
                label="Compte Banque par défaut"
              >
                <Select 
                  placeholder="Sélectionner le compte banque"
                  showSearch
                >
                  {accountOptions
                    .filter(acc => acc.value.startsWith('52'))
                    .map(acc => (
                    <Option key={acc.value} value={acc.value}>
                      {acc.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}

          {(journal.type === 'CAI' || journal.type === 'GEN') && (
            <Col span={12}>
              <Form.Item
                name="cashAccount"
                label="Compte Caisse par défaut"
              >
                <Select 
                  placeholder="Sélectionner le compte caisse"
                  showSearch
                >
                  {accountOptions
                    .filter(acc => acc.value.startsWith('57'))
                    .map(acc => (
                    <Option key={acc.value} value={acc.value}>
                      {acc.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}
        </Row>

        {/* Aide contextuelle */}
        <Alert
          message="Configuration des comptes par défaut"
          description="Ces comptes seront proposés par défaut lors de la saisie d'écritures dans ce journal. La configuration peut être modifiée à tout moment."
          type="info"
          showIcon
        />
      </Form>
    </Card>
  );
};

export default JournalConfiguration;