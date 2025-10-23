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
  Space,
  Divider
} from 'antd';
import { 
  SaveOutlined, 
  CloseOutlined 
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Product, ProductType } from '../../types';

const { Option } = Select;
const { TextArea } = Input;

interface ProductFormProps {
  product?: Product;
  categories: any[];
  onSubmit: (values: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categories,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [form] = Form.useForm();

  const initialValues = product ? {
    ...product,
  } : {
    type: 'PRODUIT',
    stockManagement: 'SUIVI',
    taxCode: 'TVA_19.25',
    pricingMethod: 'FIXE',
    purchaseUnit: 'UNITE',
    salesUnit: 'UNITE',
    conversionFactor: 1,
    currentStock: 0,
    minimumStock: 0,
    maximumStock: 0,
    isActive: true,
    isPurchasable: true,
    isSellable: true
  };

  const onFinish = (values: any) => {
    onSubmit(values);
  };

  const productTypes = [
    { value: 'PRODUIT', label: 'Produit', description: 'Article physique vendu' },
    { value: 'SERVICE', label: 'Service', description: 'Prestation de service' },
    { value: 'MATIERE', label: 'Matière première', description: 'Matériau de production' },
    { value: 'IMMOBILISATION', label: 'Immobilisation', description: 'Actif durable' }
  ];

  const taxTypes = [
    { value: 'EXONERE', label: 'Exonéré', rate: 0 },
    { value: 'TVA_5.5', label: 'TVA 5.5%', rate: 5.5 },
    { value: 'TVA_19.25', label: 'TVA 19.25%', rate: 19.25 },
    { value: 'SPECIFIQUE', label: 'Spécifique', rate: 0 }
  ];

  const stockMethods = [
    { value: 'AUCUN', label: 'Aucun suivi' },
    { value: 'SUIVI', label: 'Suivi simple' },
    { value: 'LOT', label: 'Par lot' },
    { value: 'SERIE', label: 'Par série' }
  ];

  const pricingMethods = [
    { value: 'FIXE', label: 'Prix fixe' },
    { value: 'VARIABLE', label: 'Prix variable' },
    { value: 'PROMOTION', label: 'Promotion' },
    { value: 'QUANTITE', label: 'Par quantité' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card title={product ? 'Modifier le produit' : 'Nouveau produit'}>
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={onFinish}
          size="large"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="type"
                label="Type de produit"
                rules={[{ required: true, message: 'Champ obligatoire' }]}
              >
                <Select>
                  {productTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="code"
                label="Code produit"
                rules={[{ required: true, message: 'Champ obligatoire' }]}
              >
                <Input placeholder="Auto-généré si vide" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="reference"
                label="Référence"
                rules={[{ required: true, message: 'Champ obligatoire' }]}
              >
                <Input placeholder="Référence fournisseur" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="name"
            label="Nom du produit"
            rules={[{ required: true, message: 'Champ obligatoire' }]}
          >
            <Input placeholder="Nom complet du produit" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea placeholder="Description détaillée du produit..." rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="categoryId"
                label="Catégorie"
                rules={[{ required: true, message: 'Champ obligatoire' }]}
              >
                <Select placeholder="Sélectionnez une catégorie">
                  {categories.map(category => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="brand"
                label="Marque"
              >
                <Input placeholder="Marque" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="model"
                label="Modèle"
              >
                <Input placeholder="Modèle" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Gestion des stocks</Divider>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="stockManagement"
                label="Gestion stock"
                rules={[{ required: true, message: 'Champ obligatoire' }]}
              >
                <Select>
                  {stockMethods.map(method => (
                    <Option key={method.value} value={method.value}>
                      {method.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="currentStock"
                label="Stock actuel"
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="minimumStock"
                label="Stock minimum"
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="maximumStock"
                label="Stock maximum"
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Prix et taxes</Divider>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="costPrice"
                label="Prix de revient (FCFA)"
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="standardPrice"
                label="Prix de vente (FCFA)"
                rules={[{ required: true, message: 'Champ obligatoire' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="taxCode"
                label="Taux de TVA"
                rules={[{ required: true, message: 'Champ obligatoire' }]}
              >
                <Select>
                  {taxTypes.map(tax => (
                    <Option key={tax.value} value={tax.value}>
                      {tax.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="pricingMethod"
                label="Méthode tarifaire"
                rules={[{ required: true, message: 'Champ obligatoire' }]}
              >
                <Select>
                  {pricingMethods.map(method => (
                    <Option key={method.value} value={method.value}>
                      {method.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Unités de mesure</Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="purchaseUnit"
                label="Unité d'achat"
                rules={[{ required: true, message: 'Champ obligatoire' }]}
              >
                <Input placeholder="Ex: CARTON, KG, UNITE" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="salesUnit"
                label="Unité de vente"
                rules={[{ required: true, message: 'Champ obligatoire' }]}
              >
                <Input placeholder="Ex: UNITE, HEURE, FORFAIT" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="conversionFactor"
                label="Facteur conversion"
              >
                <InputNumber
                  min={0.001}
                  step={0.1}
                  style={{ width: '100%' }}
                  placeholder="1"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Statut</Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="isActive"
                label="Produit actif"
                valuePropName="checked"
              >
                <Switch checkedChildren="Actif" unCheckedChildren="Inactif" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="isPurchasable"
                label="Achetables"
                valuePropName="checked"
              >
                <Switch checkedChildren="Oui" unCheckedChildren="Non" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="isSellable"
                label="Vendable"
                valuePropName="checked"
              >
                <Switch checkedChildren="Oui" unCheckedChildren="Non" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />}
                loading={loading}
                size="large"
              >
                {product ? 'Modifier' : 'Créer'}
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

export default ProductForm;