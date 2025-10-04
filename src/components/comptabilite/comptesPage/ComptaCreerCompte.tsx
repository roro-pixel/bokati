import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Switch, 
  Space, 
  Button, 
  message,
  Alert,
  Row,
  Col,
  Card
} from 'antd';
import { 
  SaveOutlined, 
  CloseOutlined,
  InfoCircleOutlined 
} from '@ant-design/icons';
import { ChartAccount, AccountClass, AccountType } from '../../../types';
import { useChartOfAccounts } from '../../../hooks/comptabilite/module_three/useChartOfAccounts';
import { useAccountValidation } from '../../../hooks/comptabilite/module_three/useAccountValidation';

const { Option } = Select;
const { TextArea } = Input;

interface ComptaCreerCompteProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  parentAccount?: ChartAccount;
  editAccount?: ChartAccount;
}

const ComptaCreerCompte: React.FC<ComptaCreerCompteProps> = ({
  open,
  onClose,
  onSuccess,
  parentAccount,
  editAccount
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  const { createAccount, updateAccount, accounts } = useChartOfAccounts();
  const { validateAccount, generateChildCode, classRules } = useAccountValidation();

  const isEditing = !!editAccount;

  useEffect(() => {
    if (open) {
      if (editAccount) {
        // Mode édition
        form.setFieldsValue({
          ...editAccount,
          class: editAccount.class,
          type: editAccount.type
        });
      } else {
        // Mode création
        const initialValues: any = {
          isActive: true,
          isAuxiliary: false,
          isReconcilable: false,
          class: parentAccount?.class || '1'
        };

        if (parentAccount) {
          const children = accounts.filter(acc => acc.parentId === parentAccount.id);
          const suggestedCode = generateChildCode(parentAccount.code, children);
          initialValues.code = suggestedCode;
          initialValues.class = parentAccount.class;
        }

        form.setFieldsValue(initialValues);
      }
      setValidationResult(null);
    }
  }, [open, editAccount, parentAccount, form, accounts, generateChildCode]);

  const handleValuesChange = (changedValues: any, allValues: any) => {
    const accountData: Partial<ChartAccount> = {
      ...allValues,
      level: parentAccount ? parentAccount.level + 1 : 1,
      parentId: parentAccount?.id,
      entity: 'default'
    };

    const validation = validateAccount(accountData as ChartAccount);
    setValidationResult(validation);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const accountData: Omit<ChartAccount, 'id' | 'createdAt' | 'createdBy'> = {
        ...values,
        level: parentAccount ? parentAccount.level + 1 : 1,
        parentId: parentAccount?.id,
        entity: 'default'
      };

      if (isEditing) {
        await updateAccount(editAccount.id, accountData);
        message.success('Compte modifié avec succès');
      } else {
        await createAccount(accountData);
        message.success('Compte créé avec succès');
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

  const getClassDescription = (classId: string) => {
    const rule = classRules[classId as AccountClass];
    return rule ? rule.description : '';
  };

  const getTypeOptions = (classId: string) => {
    const rule = classRules[classId as AccountClass];
    if (!rule) return [];

    return rule.type.map(type => ({
      value: type,
      label: type === 'ASSET' ? 'Actif' :
             type === 'LIABILITY' ? 'Passif' :
             type === 'EQUITY' ? 'Capitaux propres' :
             type === 'INCOME' ? 'Produit' : 'Charge'
    }));
  };

  return (
    <Modal
      title={
        <Space>
          {isEditing ? 'Modifier le Compte' : 'Créer un Nouveau Compte'}
          {parentAccount && (
            <span style={{ fontSize: '12px', color: '#666' }}>
              (Enfant de {parentAccount.code} - {parentAccount.name})
            </span>
          )}
        </Space>
      }
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
          <Col span={8}>
            <Form.Item
              name="code"
              label="Code Compte"
              rules={[
                { required: true, message: 'Le code compte est requis' },
                { pattern: /^\d{2,6}$/, message: '2-6 chiffres requis' }
              ]}
            >
              <Input 
                placeholder="Ex: 101, 411000" 
                disabled={isEditing}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="class"
              label="Classe Comptable"
              rules={[{ required: true, message: 'La classe est requise' }]}
            >
              <Select disabled={!!parentAccount || isEditing}>
                {Object.entries(classRules).map(([value, rule]) => (
                  <Option key={value} value={value}>
                    Classe {value} - {rule.description}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="type"
              label="Type de Compte"
              rules={[{ required: true, message: 'Le type est requis' }]}
            >
              <Select>
                {(getTypeOptions(form.getFieldValue('class') || '1') || []).map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="name"
          label="Nom du Compte"
          rules={[
            { required: true, message: 'Le nom du compte est requis' },
            { max: 100, message: 'Maximum 100 caractères' }
          ]}
        >
          <Input placeholder="Nom en français selon SYSCOHADA" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <TextArea
            rows={3}
            placeholder="Description supplémentaire du compte..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Card size="small" title="Options du Compte" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="isAuxiliary"
                label="Compte Auxiliaire"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Pour comptes clients/fournisseurs
              </div>
            </Col>

            <Col span={8}>
              <Form.Item
                name="isReconcilable"
                label="Compte Rapprochable"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Pour comptes banque/caisse
              </div>
            </Col>

            <Col span={8}>
              <Form.Item
                name="isActive"
                label="Compte Actif"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Disponible pour les écritures
              </div>
            </Col>
          </Row>
        </Card>

        {/* Validation */}
        {validationResult && (
          <Card size="small" title="Validation SYSCOHADA">
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
                style={{ marginBottom: 8 }}
              />
            )}

            {validationResult.suggestions.length > 0 && (
              <Alert
                message="Suggestions"
                description={
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {validationResult.suggestions.map((suggestion: string, index: number) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                }
                type="info"
                showIcon
              />
            )}

            {validationResult.isValid && validationResult.errors.length === 0 && (
              <Alert
                message="Compte valide"
                description="Le compte respecte les règles SYSCOHADA"
                type="success"
                showIcon
              />
            )}
          </Card>
        )}

        {/* Aide contextuelle */}
        <Card size="small" type="inner" title={<InfoCircleOutlined />}>
          <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
            <strong>Classe {form.getFieldValue('class') || '1'}:</strong>{' '}
            {getClassDescription(form.getFieldValue('class') || '1')}
          </div>
        </Card>
      </Form>
    </Modal>
  );
};

export default ComptaCreerCompte;