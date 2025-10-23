import React from 'react';
import { Table, Tag, Button, Space, Tooltip, Badge } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  PhoneOutlined,
  MailOutlined 
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { BusinessPartner, BusinessPartnerType } from '../../types/index';

interface PartnersTableProps {
  partners: BusinessPartner[];
  loading: boolean;
  onEdit: (partner: BusinessPartner) => void;
  onDelete: (partnerId: string) => void;
  onView: (partner: BusinessPartner) => void;
}

const PartnersTable: React.FC<PartnersTableProps> = ({
  partners,
  loading,
  onEdit,
  onDelete,
  onView
}) => {
  const getTypeColor = (type: BusinessPartnerType) => {
    return type === 'CLIENT' ? 'blue' : 'green';
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'FAIBLE': return 'success';
      case 'MOYEN': return 'warning';
      case 'ELEVE': return 'error';
      default: return 'default';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'VIP': return 'gold';
      case 'STRATEGIQUE': return 'purple';
      case 'RISQUE': return 'red';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (code: string) => (
        <motion.span whileHover={{ scale: 1.05 }} style={{ fontWeight: 'bold' }}>
          {code}
        </motion.span>
      )
    },
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: BusinessPartner) => (
        <Space direction="vertical" size={0}>
          <strong>{name}</strong>
          <small style={{ color: '#666' }}>{record.activitySector}</small>
        </Space>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: BusinessPartnerType) => (
        <Tag color={getTypeColor(type)}>
          {type === 'CLIENT' ? '👤 Client' : '🏭 Fournisseur'}
        </Tag>
      )
    },
    {
      title: 'Catégorie',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => (
        <Tag color={getCategoryColor(category)}>
          {category}
        </Tag>
      )
    },
    {
      title: 'Solde',
      dataIndex: 'currentBalance',
      key: 'currentBalance',
      width: 130,
      render: (balance: number, record: BusinessPartner) => (
        <motion.span
          style={{ 
            color: balance > 0 ? '#ff4d4f' : '#52c41a',
            fontWeight: 'bold'
          }}
          whileHover={{ scale: 1.05 }}
        >
          {balance > 0 ? '+' : ''}{balance.toLocaleString()} FCFA
        </motion.span>
      )
    },
    {
      title: 'Risque',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      width: 100,
      render: (riskLevel: string, record: BusinessPartner) => (
        <Badge 
          status={getRiskColor(riskLevel) as any} 
          text={riskLevel}
        />
      )
    },
    {
      title: 'Contact',
      key: 'contact',
      width: 100,
      render: (_, record: BusinessPartner) => {
        const primaryContact = record.contacts.find(contact => contact.isPrimary);
        return primaryContact ? (
          <Space>
            <Tooltip title={`Appeler ${primaryContact.phone}`}>
              <Button 
                type="text" 
                icon={<PhoneOutlined />} 
                size="small"
              />
            </Tooltip>
            <Tooltip title={`Envoyer email à ${primaryContact.email}`}>
              <Button 
                type="text" 
                icon={<MailOutlined />} 
                size="small"
              />
            </Tooltip>
          </Space>
        ) : null;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record: BusinessPartner) => (
        <Space>
          <Tooltip title="Voir détails">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title="Modifier">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Table
        columns={columns}
        dataSource={partners}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} sur ${total} partenaires`
        }}
        scroll={{ x: 1000 }}
      />
    </motion.div>
  );
};

export default PartnersTable;