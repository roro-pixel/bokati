import React from 'react';
import { Table, Tag, Button, Space, Tooltip, Badge } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  CheckCircleOutlined,
  TruckOutlined,
  FilePdfOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { SaleOrder, SaleStatus, DeliveryStatus } from '../../types';

interface SalesOrdersTableProps {
  orders: SaleOrder[];
  loading: boolean;
  onEdit: (order: SaleOrder) => void;
  onDelete: (orderId: string) => void;
  onView: (order: SaleOrder) => void;
  onUpdateStatus: (orderId: string, status: SaleStatus) => void;
}

const SalesOrdersTable: React.FC<SalesOrdersTableProps> = ({
  orders,
  loading,
  onEdit,
  onDelete,
  onView,
  onUpdateStatus
}) => {
  const getStatusColor = (status: SaleStatus) => {
    switch (status) {
      case 'BROUILLON': return 'default';
      case 'EN_ATTENTE': return 'blue';
      case 'CONFIRME': return 'processing';
      case 'LIVRE': return 'success';
      case 'FACTURE': return 'purple';
      case 'ANNULE': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: SaleStatus) => {
    switch (status) {
      case 'BROUILLON': return 'Brouillon';
      case 'EN_ATTENTE': return 'En attente';
      case 'CONFIRME': return 'Confirmé';
      case 'LIVRE': return 'Livré';
      case 'FACTURE': return 'Facturé';
      case 'ANNULE': return 'Annulé';
      default: return status;
    }
  };

  const getDeliveryStatusColor = (status: DeliveryStatus) => {
    switch (status) {
      case 'EN_PREPARATION': return 'blue';
      case 'PARTIELLEMENT_LIVRE': return 'orange';
      case 'LIVRE': return 'green';
      case 'RETOUR': return 'red';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'N° Commande',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
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
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 100,
      render: (date: Date) => new Date(date).toLocaleDateString('fr-FR')
    },
    {
      title: 'Montant',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount: number, record: SaleOrder) => (
        <Space direction="vertical" size={0}>
          <strong style={{ color: '#1890ff' }}>
            {amount.toLocaleString()} FCFA
          </strong>
          <small style={{ color: '#52c41a' }}>
            Payé: {record.paidAmount.toLocaleString()} FCFA
          </small>
        </Space>
      )
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: SaleStatus) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: 'Livraison',
      dataIndex: 'deliveryStatus',
      key: 'deliveryStatus',
      width: 120,
      render: (status: DeliveryStatus) => (
        <Badge 
          status={getDeliveryStatusColor(status) as any} 
          text={status.replace('_', ' ')}
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, record: SaleOrder) => (
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
          {record.status === 'EN_ATTENTE' && (
            <Tooltip title="Confirmer">
              <Button 
                type="text" 
                icon={<CheckCircleOutlined />}
                onClick={() => onUpdateStatus(record.id, 'CONFIRME')}
              />
            </Tooltip>
          )}
          {record.status === 'CONFIRME' && (
            <Tooltip title="Marquer comme livré">
              <Button 
                type="text" 
                icon={<TruckOutlined />}
                onClick={() => onUpdateStatus(record.id, 'LIVRE')}
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
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} sur ${total} commandes`
        }}
        scroll={{ x: 900 }}
      />
    </motion.div>
  );
};

export default SalesOrdersTable;