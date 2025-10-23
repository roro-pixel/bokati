import React from 'react';
import { 
  Form, 
  Input, 
  Select, 
  Button, 
  Row, 
  Col, 
  InputNumber,
  Switch,
  Card,
  Space
} from 'antd';
import { 
  SaveOutlined, 
  CloseOutlined 
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { BusinessPartner, BusinessPartnerType } from '../../types/index';
import PartnerContacts from './PartnerContacts';

const { Option } = Select;
const { TextArea } = Input;

interface PartnerFormProps {
  partner?: BusinessPartner;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

const PartnerForm: React.FC<PartnerFormProps> = ({
  partner,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [form] = Form.useForm();

  const initialValues = partner ? {
    ...partner,
    // Transformation des données si nécessaire
  } : {
    type: 'CLIENT',
    legalForm: 'SARL',
    category: 'STANDARD',
    riskLevel: 'FAIBLE',
    paymentTerms: '30J',
    paymentMethod: 'VIREMENT',
    discountRate: 0,
    creditLimit: 0,
    isActive: true
  };

  const onFinish = (values: any) => {
    onSubmit(values);
  };

  const activitySectors = [
    'BTP',
    'GROSSISTE',
    'DETAIL',
    'SERVICES',
    'INDUSTRIE',
    'AGRICULTURE',
    'TRANSPORT',
    'BANQUE',
    'ASSURANCE',
    'SANTE',
    'EDUCATION',
    'TECHNOLOGIE',
    'AUTRE'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card title={partner ? 'Modifier le partenaire' : 'Nouveau partenaire'}>
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={onFinish}
          size="large"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Type de partenaire"
                rules={[{ required: true, message: 'Champ obligatoire' }]}
              >
                <Select>
                  <Option value="CLIENT">Client</Option>
                  <Option value="FOURNISSEUR">Fournisseur</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Nom complet"
                rules={[{ required: true, message: 'Champ obligatoire' }]}
              >
                <Input placeholder="Nom de l'entreprise" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="legalForm"
                label="Forme juridique"
                rules={[{ required: true, message: 'Champ obligatoire' }]}
              >
                <Select>
                  <Option value="SARL">SARL</Option>
                  <Option value="SA">SA</Option>
                  <Option value="EI">Entreprise Individuelle</Option>
                  <Option value="SNC">SNC</Option>
                  <Option value="GIE">GIE</Option>
                  <Option value="AUTRE">Autre</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="taxId"
                label="NIU"
                rules={[{ required: true, message: 'Champ obligatoire' }]}
              >
                <Input placeholder="Numéro d'Identification Unique" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="rccm"
                label="RCCM"
              >
                <Input placeholder="Registre du Commerce" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="activitySector"
                label="Secteur d'activité"
                rules={[{ required: true, message: 'Champ obligatoire' }]}
              >
                <Select showSearch placeholder="Sélectionnez un secteur">
                  {activitySectors.map(sector => (
                    <Option key={sector} value={sector}>{sector}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Catégorie"
                rules={[{ required: true, message: 'Champ obligatoire' }]}
              >
                <Select>
                  <Option value="STANDARD">Standard</Option>
                  <Option value="VIP">VIP</Option>
                  <Option value="STRATEGIQUE">Stratégique</Option>
                  <Option value="RISQUE">Risque</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Card type="inner" title="Coordonnées" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="address"
                  label="Adresse"
                  rules={[{ required: true, message: 'Champ obligatoire' }]}
                >
                  <Input placeholder="Adresse complète" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="city"
                  label="Ville"
                  rules={[{ required: true, message: 'Champ obligatoire' }]}
                >
                  <Input placeholder="Ville" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="country"
                  label="Pays"
                  rules={[{ required: true, message: 'Champ obligatoire' }]}
                >
                  <Input defaultValue="Cameroun" placeholder="Pays" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="phone"
                  label="Téléphone"
                  rules={[{ required: true, message: 'Champ obligatoire' }]}
                >
                  <Input placeholder="+237 XXX XXX XXX" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Champ obligatoire' },
                    { type: 'email', message: 'Email invalide' }
                  ]}
                >
                  <Input placeholder="email@entreprise.com" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="website"
                  label="Site web"
                >
                  <Input placeholder="www.entreprise.com" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card type="inner" title="Conditions commerciales" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="paymentTerms"
                  label="Conditions de paiement"
                  rules={[{ required: true, message: 'Champ obligatoire' }]}
                >
                  <Select>
                    <Option value="IMMEDIAT">Immédiat</Option>
                    <Option value="30J">30 jours</Option>
                    <Option value="60J">60 jours</Option>
                    <Option value="90J">90 jours</Option>
                    <Option value="120J">120 jours</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="paymentMethod"
                  label="Mode de paiement"
                  rules={[{ required: true, message: 'Champ obligatoire' }]}
                >
                  <Select>
                    <Option value="VIREMENT">Virement</Option>
                    <Option value="CHEQUE">Chèque</Option>
                    <Option value="CASH">Espèces</Option>
                    <Option value="MOBILE">Mobile Money</Option>
                    <Option value="CREDIT">Crédit</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="discountRate"
                  label="Taux de remise (%)"
                >
                  <InputNumber
                    min={0}
                    max={100}
                    style={{ width: '100%' }}
                    placeholder="0"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="creditLimit"
                  label="Limite de crédit (FCFA)"
                >
                  <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    addonAfter="FCFA"
                    placeholder="0"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="riskLevel"
                  label="Niveau de risque"
                  rules={[{ required: true, message: 'Champ obligatoire' }]}
                >
                  <Select>
                    <Option value="FAIBLE">Faible</Option>
                    <Option value="MOYEN">Moyen</Option>
                    <Option value="ELEVE">Élevé</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Section Contacts - À ajouter dans PartnerForm.tsx */}
<Card type="inner" title="Contacts" style={{ marginBottom: 16 }}>
  <PartnerContacts
    contacts={form.getFieldValue('contacts') || []}
    partnerId={partner?.id || 'new'}
    onContactsUpdate={(newContacts) => form.setFieldValue('contacts', newContacts)}
  />
</Card>

          <Form.Item
            name="isActive"
            label="Statut"
            valuePropName="checked"
          >
            <Switch checkedChildren="Actif" unCheckedChildren="Inactif" defaultChecked />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />}
                loading={loading}
                size="large"
              >
                {partner ? 'Modifier' : 'Créer'}
              </Button>
              <Button 
                onClick={onCancel}
                icon={<CloseOutlined />}
                size="large"
              >
                Annuler
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </motion.div>
  );
};

export default PartnerForm;