import { 
  Card, 
  Col, 
  Row, 
  Tabs, 
  Tag, 
  Space, 
  Statistic, 
  Button, 
  Progress 
} from 'antd';
import { 
  PieChartOutlined, 
  SwapOutlined, 
  LockOutlined, 
  SettingOutlined,
  FundOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const FinancesDashboard = () => {
  const navigate = useNavigate();
  
  // Données simulées
  const budgetData = {
    total: 5000000,
    utilized: 3200000,
    categories: ['Personnel', 'Logistique', 'Investissements']
  };

  const engagementStats = [
    { type: 'Donnés', count: 24, color: 'blue' },
    { type: 'Reçus', count: 15, color: 'green' }
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">
        <FundOutlined /> Dashboard Financier
      </h1>

      {/* Cartes de synthèse */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card 
            hoverable 
            onClick={() => navigate('/finances/budget')}
            title="Budget Global"
          >
            <Space direction="vertical">
              <Statistic 
                title="Total" 
                value={budgetData.total.toLocaleString()} 
                prefix="FCFA" 
              />
              <Progress
                percent={Math.round((budgetData.utilized / budgetData.total) * 100)}
                status="active"
              />
            </Space>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card
            hoverable
            onClick={() => navigate('/finances/engagement')}
            title="Engagements"
          >
            {engagementStats.map(item => (
              <Tag color={item.color} key={item.type} className="mb-2">
                {item.type}: {item.count}
              </Tag>
            ))}
          </Card>
        </Col>

        <Col span={8}>
          <Card
            hoverable
            onClick={() => navigate('/finances/tresorerie')}
            title="Trésorerie"
          >
            <Statistic 
              title="Solde Disponible" 
              value="1,250,000" 
              prefix="FCFA" 
            />
          </Card>
        </Col>
      </Row>

      {/* Navigation par onglets */}
      <Tabs
        defaultActiveKey="1"
        onChange={(key) => navigate(`/finances/${key}`)}
      >
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

      {/* Zone de rapports rapides */}
      <Card title="Rapports" className="mt-6">
        <Space>
          <Button type="primary" onClick={() => navigate('/finances/budget/rapports')}>
            Standards
          </Button>
          <Button onClick={() => navigate('/finances/budget/custom')}>
            Personnalisés
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default FinancesDashboard;