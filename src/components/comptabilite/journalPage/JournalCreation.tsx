import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Switch, 
  Space, 
  Button, 
  Alert,
  Row,
  Col,
  Card,
  Tag
} from 'antd';
import { 
  SaveOutlined, 
  CloseOutlined,
  InfoCircleOutlined 
} from '@ant-design/icons';
import { Journal, JournalType } from '../../../types';
import { useJournalManagement } from '../../../hooks/comptabilite/module_four/useJournalManagement';
import { useJournalValidation } from '../../../hooks/comptabilite/module_four/useJournalValidation';

const { Option } = Select;
const { TextArea } = Input;

interface JournalCreationProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editJournal?: Journal;
}

const JournalCreation: React.FC<JournalCreationProps> = ({
  open,
  onClose,
  onSuccess,
  editJournal
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  const { createJournal, updateJournal, journals } = useJournalManagement();
  const { validateJournal, getSuggestedAccounts, journalRules } = useJournalValidation();

  const isEditing = !!editJournal;

  // Types de journaux disponibles
  const journalTypes: { value: JournalType; label: string }[] = [
    { value: 'GEN', label: 'Journal Général' },
    { value: 'VTE', label: 'Journal des Ventes' },
    { value: 'ACH', label: 'Journal des Achats' },
    { value: 'BNQ', label: 'Journal de Banque' },
    { value: 'CAI', label: 'Journal de Caisse' }
  ];

  useEffect(() => {
    if (open) {
      if (editJournal) {
        // Mode édition
        form.setFieldsValue({
          ...editJournal,
          type: editJournal.type
        });
      } else {
        // Mode création - valeurs par défaut
        form.setFieldsValue({
          isActive: true,
          requiresApproval: true,
          approvalLevel: 1
        });
      }
      setValidationResult(null);
    }
  }, [open, editJournal, form]);

  const handleValuesChange = (changedValues: any, allValues: any) => {
    const journalData: Partial<Journal> = {
      ...allValues,
      entity: 'default',
      sequenceId: `seq-${allValues.code?.toLowerCase() || 'new'}`
    };

    if (journalData.code && journalData.type) {
      const validation = validateJournal(journalData as Journal);
      setValidationResult(validation);
    }
  };

  const handleTypeChange = (type: JournalType) => {
    // Auto-remplir le code avec le type
    form.setFieldValue('code', type);
    
    // Auto-remplir le nom avec le nom du type
    const typeInfo = journalTypes.find(t => t.value === type);
    if (typeInfo && !form.getFieldValue('name')) {
      form.setFieldValue('name', typeInfo.label);
    }

    // Définir les valeurs par défaut selon le type
    const rule = journalRules[type];
    if (rule) {
      form.setFieldValue('requiresApproval', rule.requiresApproval);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const journalData: Omit<Journal, 'id' | 'createdAt' | 'createdBy'> = {
        ...values,
        entity: 'default',
        sequenceId: `seq-${values.code.toLowerCase()}`
      };

      if (isEditing) {
        await updateJournal(editJournal.id, journalData);
      } else {
        await createJournal(journalData);
      }

      form.resetFields();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const suggestedAccounts = getSuggestedAccounts(form.getFieldValue('type') || 'GEN');

  return (
    <Modal
      title={isEditing ? 'Modifier le Journal' : 'Créer un Nouveau Journal'}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" icon={<CloseOutlined />} onClick={onClose}>
          Annuler
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={<SaveOutlined />}
          loading={loading}
          onClick={handleSubmit}
          disabled={validationResult && !validationResult.isValid}
        >
          {isEditing ? 'Modifier' : 'Créer'}
        </Button>
      ]}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="type"
              label="Type de Journal"
              rules={[{ required: true, message: 'Le type est requis' }]}
            >
              <Select 
                placeholder="Sélectionner le type"
                onChange={handleTypeChange}
                disabled={isEditing}
              >
                {journalTypes.map(type => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="code"
              label="Code Journal"
              rules={[
                { required: true, message: 'Le code est requis' },
                { pattern: /^[A-Z]{3}$/, message: '3 lettres majuscules requis' }
              ]}
            >
              <Input 
                placeholder="Ex: GEN, VTE, ACH" 
                disabled={isEditing}
                style={{ textTransform: 'uppercase' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="name"
          label="Nom du Journal"
          rules={[
            { required: true, message: 'Le nom est requis' },
            { max: 50, message: 'Maximum 50 caractères' }
          ]}
        >
          <Input placeholder="Nom complet du journal" />
        </Form.Item>

        <Card size="small" title="Configuration" style={{ marginBottom: 16 }}>
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
        </Card>

        {/* Comptes par défaut suggérés */}
        {suggestedAccounts.length > 0 && (
          <Card size="small" title="Comptes Recommandés" type="inner">
            <div style={{ fontSize: '12px', color: '#666', marginBottom: 8 }}>
              Comptes typiquement utilisés avec ce type de journal:
            </div>
            <Space wrap>
              {suggestedAccounts.map(account => (
                <Tag key={account.code} color="blue">
                  {account.code} - {account.name}
                </Tag>
              ))}
            </Space>
          </Card>
        )}

        {/* Validation */}
        {validationResult && (
          <Card size="small" title="Validation" style={{ marginTop: 16 }}>
            {validationResult.errors.length > 0 && (
              <Alert
                message="Erreurs de validation"
                description={
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {validationResult.errors.map((error: string, index: number) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                }
                type="error"
                showIcon
                style={{ marginBottom: 8 }}
              />
            )}

            {validationResult.warnings.length > 0 && (
              <Alert
                message="Avertissements"
                description={
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {validationResult.warnings.map((warning: string, index: number) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                }
                type="warning"
                showIcon
              />
            )}

            {validationResult.isValid && validationResult.errors.length === 0 && (
              <Alert
                message="Journal valide"
                description="La configuration du journal est correcte"
                type="success"
                showIcon
              />
            )}
          </Card>
        )}

        {/* Aide contextuelle */}
        {form.getFieldValue('type') && (
          <Card size="small" type="inner" title={<InfoCircleOutlined />}>
            <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
              <strong>{journalRules[form.getFieldValue('type')]?.name}:</strong>{' '}
              {journalRules[form.getFieldValue('type')]?.description}
            </div>
          </Card>
        )}
      </Form>
    </Modal>
  );
};

export default JournalCreation;