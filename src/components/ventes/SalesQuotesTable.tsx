import React from 'react';
import { Table, Tag, Button, Space, Tooltip } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  CheckOutlined,
  FileTextOutlined,
  SendOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { SaleQuote, QuoteStatus } from '../../types';

interface SalesQuotesTableProps {
  quotes: SaleQuote[];
  loading: boolean;
  onEdit: (quote: SaleQuote) => void;
  onDelete: (quoteId: string) => void;
  onView: (quote: SaleQuote) => void;
  onConvert: (quoteId: string) => void;
}

const SalesQuotesTable: React.FC<SalesQuotesTableProps> = ({
  quotes,
  loading,
  onEdit,
  onDelete,
  onView,
  onConvert
}) => {
  const getStatusColor = (status: QuoteStatus) => {
    switch (status) {
      case 'BROUILLON': return 'default';
      case 'ENVOYE': return 'blue';
      case 'ACCEPTE': return 'success';
      case 'REFUSE': return 'error';
      case 'EXPIRE': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: QuoteStatus) => {
    switch (status) {
      case 'BROUILLON': return 'Brouillon';
      case 'ENVOYE': return 'Envoyé';
      case 'ACCEPTE': return 'Accepté';
      case 'REFUSE': return 'Refusé';
      case 'EXPIRE': return 'Expiré';
      default: return status;
    }
  };

  const columns = [
    {
      title: 'N° Devis',
      dataIndex: 'quoteNumber',
      key: 'quoteNumber',
      width: 120,
      render: (number: string) => (
        <motion.span whileHover={{ scale: 1.05 }} style={{ fontWeight: 'bold' }}>
          {number}
        </motion.span>
      )
    },
    {
      title: 'Client',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Date',
      dataIndex: 'quoteDate',
      key: 'quoteDate',
      width: 100,
      render: (date: Date) => new Date(date).toLocaleDateString('fr-FR')
    },
    {
      title: 'Validité',
      dataIndex: 'validUntil',
      key: 'validUntil',
      width: 100,
      render: (date: Date) => new Date(date).toLocaleDateString('fr-FR')
    },
    {
      title: 'Montant',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount: number) => (
        <strong style={{ color: '#1890ff' }}>
          {amount.toLocaleString()} FCFA
        </strong>
      )
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: QuoteStatus) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record: SaleQuote) => (
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
          {record.status === 'ACCEPTE' && (
            <Tooltip title="Convertir en commande">
              <Button 
                type="text" 
                icon={<CheckOutlined />}
                onClick={() => onConvert(record.id)}
              />
            </Tooltip>
          )}
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
        dataSource={quotes}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} sur ${total} devis`
        }}
        scroll={{ x: 800 }}
      />
    </motion.div>
  );
};

export default SalesQuotesTable;