import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Tabs,
  Button,
  Space,
  Tag,
  List,
  Input,
  Select,
  // Divider
} from 'antd';
import { 
  PieChartOutlined, 
  LockOutlined, 
  SwapOutlined,
  SettingOutlined,
  FundOutlined,
  EyeOutlined,
  ArrowRightOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const FinancesDashboard = () => {
  const navigate = useNavigate();

  // Données simulées pour le résumé
  const financialSummary = {
    solde: 1250000,
    budgetTotal: 5000000,
    budgetUtilise: 3200000,
    engagementsDonnes: 24,
    engagementsRecus: 15,
    seuilAlerte: 500000
  };

  return (
    <div className="p-4">
      {/* En-tête du dashboard */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          <FundOutlined /> Dashboard Financier
        </h1>
        <p className="text-gray-600">Vue d'ensemble de votre situation financière</p>
      </div>

      {/* Section Résumé Principal */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic 
              title="Solde Disponible" 
              value={financialSummary.solde} 
              prefix="FCFA"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Budget Utilisé" 
              value={financialSummary.budgetUtilise} 
              prefix="FCFA"
            />
            <Progress
              percent={Math.round((financialSummary.budgetUtilise / financialSummary.budgetTotal) * 100)}
              size="small"
              className="mt-2"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="mb-2">
              <Tag color="blue">Engagements Donnés: {financialSummary.engagementsDonnes}</Tag>
            </div>
            <div>
              <Tag color="green">Engagements Reçus: {financialSummary.engagementsRecus}</Tag>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Seuil d'Alerte" 
              value={financialSummary.seuilAlerte} 
              prefix="FCFA"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Navigation par onglets */}
      <Tabs
        defaultActiveKey="dashboard"
        onChange={(key) => navigate(`/finances/${key}`)}
        className="mb-6"
      >
        <Tabs.TabPane
          tab={
            <span>
              <FundOutlined />
              Dashboard
            </span>
          }
          key="dashboard"
        />
        <Tabs.TabPane
          tab={
            <span>
              <PieChartOutlined />
              Budgetisation
            </span>
          }
          key="budget"
        />
        <Tabs.TabPane
          tab={
            <span>
              <LockOutlined />
              Engagements
            </span>
          }
          key="engagement"
        />
        <Tabs.TabPane
          tab={
            <span>
              <SwapOutlined />
              Trésorerie
            </span>
          }
          key="tresorerie"
        />
        <Tabs.TabPane
          tab={
            <span>
              <SettingOutlined />
              Configuration
            </span>
          }
          key="config"
        />
      </Tabs>

      {/* Section Configuration (contenu de votre image) */}
      <Card title="Configuration Rapide" className="mb-4">
        <Row gutter={16}>
          <Col span={12}>
            <h3>Comptes Bancaires</h3>
            <div className="text-center text-gray-400 py-4 my-2 border rounded">
              No data
            </div>
            <Button type="primary" icon={<PlusOutlined />} block>
              Ajouter un compte
            </Button>
          </Col>
          
          <Col span={12}>
            <h3>Paramètres Généraux</h3>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <label>Seuil d'alerte trésorerie</label>
                <Input 
                  addonBefore="FCFA" 
                  placeholder="Montant" 
                  defaultValue={financialSummary.seuilAlerte}
                />
              </div>
              <div>
                <label>Période de prévision</label>
                <Select style={{ width: '100%' }} placeholder="Sélectionner">
                  <Option value="30">30 jours</Option>
                  <Option value="60">60 jours</Option>
                  <Option value="90">90 jours</Option>
                </Select>
              </div>
              <Button type="primary">Sauvegarder les paramètres</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Accès rapides */}
      <Row gutter={16}>
        <Col span={8}>
          <Card 
            hoverable 
            onClick={() => navigate('/finances/budget')}
            actions={[<EyeOutlined />, <ArrowRightOutlined />]}
          >
            <Card.Meta
              title="Budget Détaillé"
              description="Consultez le détail du budget et les catégories"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card 
            hoverable 
            onClick={() => navigate('/finances/engagement')}
            actions={[<EyeOutlined />, <ArrowRightOutlined />]}
          >
            <Card.Meta
              title="Gestion des Engagements"
              description="Suivez les engagements donnés et reçus"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card 
            hoverable 
            onClick={() => navigate('/finances/tresorerie')}
            actions={[<EyeOutlined />, <ArrowRightOutlined />]}
          >
            <Card.Meta
              title="Trésorerie Détaillée"
              description="Analyser les flux de trésorerie"
            />
          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default FinancesDashboard;