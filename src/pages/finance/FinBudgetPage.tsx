import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Select, Button, Space } from 'antd';
import {ArrowLeftOutlined}  from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';
import { useTreasuryManagement } from '../../hooks/finance';
import { FinBudgetChart } from '../../components/finance/budget/FinBudgetChart';
import { FinCategorySelector } from '../../components/finance/budget/FinCategorySelector';

export const FinBudgetPage = () => {
  const navigate = useNavigate();
  const { budgets } = useTreasuryManagement();
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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
    <h2 className="text-xl font-semibold mb-0">Gestion des Budgets</h2>
  </div>
  <Button type="primary" icon={<PlusOutlined />}>
    Nouveau Budget
  </Button>
</div>

      <Row gutter={16}>
        <Col span={6}>
          <FinCategorySelector
            budgets={budgets}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
          />
        </Col>
        
        <Col span={18}>
          <Space direction="vertical" className="w-full">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <Select
                  placeholder="Sélectionner un budget"
                  style={{ width: 300 }}
                  value={selectedBudget}
                  onChange={setSelectedBudget}
                  options={budgets.map(b => ({
                    value: b.id,
                    label: `${b.name} - ${b.status}`
                  }))}
                />
              </div>
              
              <FinBudgetChart
                budgets={budgets}
                selectedBudget={selectedBudget}
                onBudgetSelect={setSelectedBudget}
              />
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default FinBudgetPage;