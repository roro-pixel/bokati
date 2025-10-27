import { Card, Button, Table, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTreasuryManagement } from '../../hooks/finance';
import { FinEngagementForm } from '../../components/finance/engagement/FinEngagementForm';
import { FinTypeBadge } from '../../components/finance/engagement/FinTypeBadge';
import { Engagement } from '../../types/index';

export const FinEngagementPage = () => {
  const navigate = useNavigate();
  const { engagements, budgets, createEngagement } = useTreasuryManagement();
  const [showForm, setShowForm] = useState(false);

  const columns = [
    {
      title: 'N° Engagement',
      dataIndex: 'engagementNumber',
      key: 'engagementNumber',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <FinTypeBadge type={type} size="sm" />
    },
    {
      title: 'Fournisseur',
      dataIndex: 'supplierName',
      key: 'supplierName',
    },
    {
      title: 'Montant',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'XAF' 
      }).format(amount)
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'COMMITTED' ? 'blue' :
          status === 'PAID' ? 'green' : 'orange'
        }>
          {status}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Button icon={<EditOutlined />} size="small">
          Modifier
        </Button>
      )
    }
  ];

  if (showForm) {
    return (
      <FinEngagementForm
        budgets={budgets}
        onSubmit={createEngagement}
        onCancel={() => setShowForm(false)}
      />
    );
  }

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
      <h2 className="text-xl font-semibold mb-0">Gestion des Engagements</h2>
  </div>
  <Button type="primary" icon={<PlusOutlined />}>
    Nouveau Engagement
  </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={engagements}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default FinEngagementPage;