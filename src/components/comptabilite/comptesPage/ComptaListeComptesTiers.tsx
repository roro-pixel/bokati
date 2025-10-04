import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Space, 
  Button, 
  Input, 
  Select,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  UserOutlined, 
  ShopOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined
} from '@ant-design/icons';
import { ChartAccount } from '../../../types';

const { Search } = Input;
const { Option } = Select;

interface ComptaListeComptesTiersProps {
  accounts: ChartAccount[];
  onEditAccount: (account: ChartAccount) => void;
  onAddAccount: () => void;
}

const ComptaListeComptesTiers: React.FC<ComptaListeComptesTiersProps> = ({
  accounts,
  onEditAccount,
  onAddAccount
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'client' | 'supplier'>('all');

  // Filtrer les comptes de tiers (classe 4)
  const tierAccounts = accounts.filter(account => 
    account.class === '4' && account.isActive && account.isAuxiliary
  );

  // Filtrer selon la recherche et le type
  const filteredAccounts = tierAccounts.filter(account => {
    const matchesSearch = !searchQuery || 
      account.code.includes(searchQuery) || 
      account.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || 
      (typeFilter === 'client' && account.code.startsWith('411')) ||
      (typeFilter === 'supplier' && account.code.startsWith('401'));

    return matchesSearch && matchesType;
  });

  // Statistiques
  const clientAccounts = tierAccounts.filter(acc => acc.code.startsWith('411'));
  const supplierAccounts = tierAccounts.filter(acc => acc.code.startsWith('401'));
  const otherTierAccounts = tierAccounts.filter(acc => 
    !acc.code.startsWith('411') && !acc.code.startsWith('401')
  );

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      render: (code: string) => <strong>{code}</strong>
    },
    {
      title: 'Type',
      key: 'type',
      width: 100,
      render: (_, record: ChartAccount) => {
        if (record.code.startsWith('411')) {
          return <Tag color="blue" icon={<UserOutlined />}>Client</Tag>;
        } else if (record.code.startsWith('401')) {
          return <Tag color="green" icon={<ShopOutlined />}>Fournisseur</Tag>;
        } else {
          return <Tag color="orange">Autre Tiers</Tag>;
        }
      }
    },
    {
      title: 'Nom du Compte',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: ChartAccount) => (
        <div>
          <div>{name}</div>
          {record.description && (
            <div style={{ fontSize: '12px', color: '#666' }}>{record.description}</div>
          )}
        </div>
      )
    },
    {
      title: 'Rapprochable',
      dataIndex: 'isReconcilable',
      key: 'isReconcilable',
      width: 100,
      render: (isReconcilable: boolean) => (
        <Tag color={isReconcilable ? 'green' : 'default'}>
          {isReconcilable ? 'Oui' : 'Non'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record: ChartAccount) => (
        <Button 
          size="small" 
          icon={<EditOutlined />}
          onClick={() => onEditAccount(record)}
        >
          Modifier
        </Button>
      )
    }
  ];

  return (
    <div>
      {/* Statistiques */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Total Comptes Tiers"
              value={tierAccounts.length}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Comptes Clients"
              value={clientAccounts.length}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Comptes Fournisseurs"
              value={supplierAccounts.length}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Autres Tiers"
              value={otherTierAccounts.length}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Barre de recherche et filtres */}
      <Card 
        title="Comptes de Tiers"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={onAddAccount}
          >
            Nouveau Compte Tiers
          </Button>
        }
      >
        <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
          <Space>
            <Search
              placeholder="Rechercher un compte tiers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
            
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: 150 }}
            >
              <Option value="all">Tous les types</Option>
              <Option value="client">Clients seulement</Option>
              <Option value="supplier">Fournisseurs seulement</Option>
            </Select>
          </Space>

          <div>
            <Tag color="blue">
              {filteredAccounts.length} compte(s) trouvé(s)
            </Tag>
          </div>
        </Space>

        {/* Tableau des comptes tiers */}
        <Table
          columns={columns}
          dataSource={filteredAccounts}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} sur ${total} comptes tiers`
          }}
          scroll={{ x: 600 }}
        />
      </Card>
    </div>
  );
};

export default ComptaListeComptesTiers;