import { Card, Row, Col, Button, Input, Select, Form, List } from 'antd';
import { PlusOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useBankAccounts } from '../../hooks/finance';

export const FinConfigPage = () => {
const navigate = useNavigate();
  const { accounts, createAccount } = useBankAccounts();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Configuration sauvegardée:', values);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
  <div className="flex items-center">
    <Button 
      icon={<ArrowLeftOutlined />} 
      onClick={() => navigate('/finances')}
      type="text"
      className="mr-2 border border-gray-300"
    />
    <h2 className="text-xl font-semibold mb-0">Configuration Finance</h2>
  </div>
</div>
      
      <Row gutter={16}>
        <Col span={12}>
          <Card 
            title="Comptes Bancaires" 
            extra={<Button icon={<PlusOutlined />} size="small">Ajouter</Button>}
          >
            <List
              dataSource={accounts}
              renderItem={(account) => (
                <List.Item
                  actions={[<Button icon={<DeleteOutlined />} danger size="small" />]}
                >
                  <List.Item.Meta
                    title={account.name}
                    description={`${account.bankName} - ${account.accountNumber}`}
                  />
                  <div>
                    {new Intl.NumberFormat('fr-FR', { 
                      style: 'currency', 
                      currency: 'XAF' 
                    }).format(account.currentBalance)}
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Paramètres Généraux">
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item label="Seuil d'alerte trésorerie" name="alertThreshold">
                <Input prefix="FCFA" placeholder="Montant" />
              </Form.Item>
              
              <Form.Item label="Période de prévision" name="forecastPeriod">
                <Select placeholder="Sélectionner">
                  <Select.Option value="MONTHLY">Mensuelle</Select.Option>
                  <Select.Option value="QUARTERLY">Trimestrielle</Select.Option>
                  <Select.Option value="ANNUAL">Annuelle</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Sauvegarder les paramètres
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Card title="SYSCOHADA Révise v1.0.0" className="mt-6">
        <div className="text-center text-gray-500">
          Système Comptable OHADA Révisé - Version 1.0.0
        </div>
      </Card>
    </div>
  );
};

export default FinConfigPage;