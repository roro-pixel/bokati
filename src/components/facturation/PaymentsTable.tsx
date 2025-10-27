import React from 'react';
import { Table, Tag, Button, Space, Tooltip } from 'antd';
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Payment } from '../../types';

interface PaymentsTableProps {
  payments: Payment[];
  loading: boolean;
  onView: (payment: Payment) => void;
  onEdit: (payment: Payment) => void;
  onDelete: (paymentId: string) => void;
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({
  payments,
  loading,
  onView,
  onEdit,
  onDelete
}) => {
  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'VIREMENT': return 'blue';
      case 'CHEQUE': return 'green';
      case 'CASH': return 'orange';
      case 'MOBILE': return 'purple';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'N° Paiement',
      dataIndex: 'paymentNumber',
      key: 'paymentNumber',
      width: 120,
      render: (number: string) => (
        <motion.span whileHover={{ scale: 1.05 }} style={{ fontWeight: 'bold' }}>
          {number}
        </motion.span>
      )
    },
    {
      title: 'Facture',
      dataIndex: 'invoiceId',
      key: 'invoiceId',
      width: 120,
      render: (invoiceId: string) => `FAC-${invoiceId.split('-')[1]}`
    },
    {
      title: 'Date',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      width: 100,
      render: (date: Date) => new Date(date).toLocaleDateString('fr-FR')
    },
    {
      title: 'Montant',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => (
        <strong style={{ color: '#52c41a' }}>
          {amount.toLocaleString()} FCFA
        </strong>
      )
    },
    {
      title: 'Méthode',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 100,
      render: (method: string) => (
        <Tag color={getPaymentMethodColor(method)}>
          {method}
        </Tag>
      )
    },
    {
      title: 'Référence',
      dataIndex: 'reference',
      key: 'reference',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record: Payment) => (
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
        dataSource={payments}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} sur ${total} paiements`
        }}
        scroll={{ x: 800 }}
      />
    </motion.div>
  );
};

export default PaymentsTable;